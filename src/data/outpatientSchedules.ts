import {
  TimeSlot,
  OutpatientSlotCell,
  DailyOutpatientSchedule,
  WeeklyOutpatientSchedule,
  Facility,
} from '@/types';
import { getWeekMonday } from '@/lib/utils';

// スケジュールテンプレート: 曜日(0=月〜5=土) × 時間帯 → totalSlots (null=休診)
type SlotTemplate = Record<TimeSlot, number | null>;
type WeekTemplate = SlotTemplate[];

// 診療科ごとの曜日テンプレート
const DEPARTMENT_TEMPLATES: Record<string, WeekTemplate> = {
  naika: [
    // 月        火        水        木        金        土
    { am: 5, pm1: 3, pm2: null }, { am: 5, pm1: null, pm2: 3 }, { am: 5, pm1: 3, pm2: null },
    { am: 5, pm1: null, pm2: null }, { am: 5, pm1: 3, pm2: null }, { am: 3, pm1: null, pm2: null },
  ],
  geka: [
    { am: 4, pm1: 2, pm2: null }, { am: 4, pm1: null, pm2: null }, { am: 4, pm1: 2, pm2: null },
    { am: null, pm1: null, pm2: null }, { am: 4, pm1: 2, pm2: null }, { am: 3, pm1: null, pm2: null },
  ],
  seikei: [
    { am: 4, pm1: 3, pm2: null }, { am: 4, pm1: 3, pm2: null }, { am: null, pm1: null, pm2: null },
    { am: 4, pm1: 3, pm2: null }, { am: 4, pm1: 3, pm2: null }, { am: 3, pm1: null, pm2: null },
  ],
  shoni: [
    { am: 6, pm1: 4, pm2: null }, { am: 6, pm1: 4, pm2: null }, { am: 6, pm1: null, pm2: null },
    { am: 6, pm1: 4, pm2: null }, { am: 6, pm1: 4, pm2: null }, { am: 4, pm1: null, pm2: null },
  ],
  sanfujinka: [
    { am: 3, pm1: 2, pm2: null }, { am: 3, pm1: null, pm2: null }, { am: 3, pm1: 2, pm2: null },
    { am: null, pm1: null, pm2: null }, { am: 3, pm1: 2, pm2: null }, { am: null, pm1: null, pm2: null },
  ],
  nouge: [
    { am: 3, pm1: null, pm2: null }, { am: 3, pm1: 2, pm2: null }, { am: null, pm1: null, pm2: null },
    { am: 3, pm1: null, pm2: null }, { am: 3, pm1: 2, pm2: null }, { am: null, pm1: null, pm2: null },
  ],
  junkanki: [
    { am: 4, pm1: 2, pm2: null }, { am: 4, pm1: null, pm2: 2 }, { am: 4, pm1: 2, pm2: null },
    { am: 4, pm1: null, pm2: null }, { am: 4, pm1: 2, pm2: null }, { am: 3, pm1: null, pm2: null },
  ],
  seishin: [
    { am: 3, pm1: 2, pm2: null }, { am: null, pm1: null, pm2: null }, { am: 3, pm1: 2, pm2: null },
    { am: 3, pm1: null, pm2: null }, { am: 3, pm1: 2, pm2: null }, { am: null, pm1: null, pm2: null },
  ],
  hinyoki: [
    { am: 4, pm1: 2, pm2: null }, { am: 4, pm1: null, pm2: null }, { am: 4, pm1: 2, pm2: null },
    { am: null, pm1: null, pm2: null }, { am: 4, pm1: 2, pm2: null }, { am: 3, pm1: null, pm2: null },
  ],
  ganka: [
    { am: 6, pm1: 4, pm2: null }, { am: 6, pm1: 4, pm2: null }, { am: 6, pm1: null, pm2: null },
    { am: 6, pm1: 4, pm2: null }, { am: 6, pm1: 4, pm2: null }, { am: 4, pm1: null, pm2: null },
  ],
  riha: [
    { am: 5, pm1: 5, pm2: null }, { am: 5, pm1: 5, pm2: null }, { am: 5, pm1: 5, pm2: null },
    { am: 5, pm1: 5, pm2: null }, { am: 5, pm1: 5, pm2: null }, { am: 3, pm1: null, pm2: null },
  ],
};

// デフォルトテンプレート（テンプレートが未定義の外来あり診療科用）
const DEFAULT_TEMPLATE: WeekTemplate = [
  { am: 4, pm1: 2, pm2: null }, { am: 4, pm1: 2, pm2: null }, { am: 4, pm1: null, pm2: null },
  { am: 4, pm1: 2, pm2: null }, { am: 4, pm1: 2, pm2: null }, { am: 3, pm1: null, pm2: null },
];

// 擬似乱数（seed付きで安定した結果を得る）
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateBookedSlots(total: number, rand: () => number): number {
  // 0〜totalの範囲でランダムに予約数を生成
  return Math.min(total, Math.floor(rand() * (total + 2)));
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function generateWeekSchedule(
  departmentId: string,
  monday: Date,
  template: WeekTemplate,
  rand: () => number,
): WeeklyOutpatientSchedule {
  const days: DailyOutpatientSchedule[] = [];

  for (let dayIdx = 0; dayIdx < 6; dayIdx++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + dayIdx);
    const dayTemplate = template[dayIdx];
    const slots: Record<TimeSlot, OutpatientSlotCell | null> = {
      am: null,
      pm1: null,
      pm2: null,
    };

    for (const ts of ['am', 'pm1', 'pm2'] as TimeSlot[]) {
      const total = dayTemplate[ts];
      if (total !== null) {
        slots[ts] = {
          totalSlots: total,
          bookedSlots: generateBookedSlots(total, rand),
        };
      }
    }

    days.push({ date: formatDateISO(date), slots });
  }

  return {
    departmentId,
    weekStartDate: formatDateISO(monday),
    days,
  };
}

export function attachOutpatientSchedules(facilitiesList: Facility[]): Facility[] {
  const today = new Date();
  const thisMonday = getWeekMonday(today);

  return facilitiesList.map((facility) => ({
    ...facility,
    departments: facility.departments.map((dept) => {
      if (!dept.hasOutpatient) return dept;

      const template = DEPARTMENT_TEMPLATES[dept.id] || DEFAULT_TEMPLATE;
      // seedを施設ID+診療科IDから生成して安定させる
      let seed = 0;
      for (const ch of facility.id + dept.id) {
        seed = ((seed << 5) - seed + ch.charCodeAt(0)) | 0;
      }
      const rand = seededRandom(Math.abs(seed));

      const weeklySchedules: WeeklyOutpatientSchedule[] = [];
      for (let weekOffset = -1; weekOffset <= 3; weekOffset++) {
        const monday = new Date(thisMonday);
        monday.setDate(thisMonday.getDate() + weekOffset * 7);
        weeklySchedules.push(generateWeekSchedule(dept.id, monday, template, rand));
      }

      return { ...dept, weeklySchedules };
    }),
  }));
}
