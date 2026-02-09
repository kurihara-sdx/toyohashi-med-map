'use client';

import { useState } from 'react';
import { Department, TimeSlot, WeeklyOutpatientSchedule } from '@/types';
import { TIME_SLOT_LABELS, DAY_OF_WEEK_LABELS, OUTPATIENT_STATUS_DISPLAY } from '@/lib/constants';
import { getOutpatientSlotStatus, getWeekMonday, formatWeekRange } from '@/lib/utils';

const TIME_SLOTS: TimeSlot[] = ['am', 'pm1', 'pm2'];

interface OutpatientCalendarProps {
  departments: Department[];
}

function getScheduleForWeekOffset(
  schedules: WeeklyOutpatientSchedule[],
  weekOffset: number,
): WeeklyOutpatientSchedule | undefined {
  const today = new Date();
  const thisMonday = getWeekMonday(today);
  const targetMonday = new Date(thisMonday);
  targetMonday.setDate(thisMonday.getDate() + weekOffset * 7);
  const targetStr = formatDateISO(targetMonday);
  return schedules.find((s) => s.weekStartDate === targetStr);
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTargetMonday(weekOffset: number): Date {
  const today = new Date();
  const monday = getWeekMonday(today);
  monday.setDate(monday.getDate() + weekOffset * 7);
  return monday;
}

export default function OutpatientCalendar({ departments }: OutpatientCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const outpatientDepts = departments.filter((d) => d.hasOutpatient && d.weeklySchedules?.length);
  const nonOutpatientDepts = departments.filter((d) => !d.hasOutpatient);

  if (outpatientDepts.length === 0 && nonOutpatientDepts.length === 0) return null;

  const monday = getTargetMonday(weekOffset);
  const weekLabel = formatWeekRange(monday);

  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-slate-800 mb-2">外来空きコマ</h3>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 mb-3">
        <button
          onClick={() => setWeekOffset((o) => Math.max(-1, o - 1))}
          disabled={weekOffset <= -1}
          className="text-xs px-2 py-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600"
        >
          ‹ 前週
        </button>
        <span className="text-xs font-semibold text-slate-700">
          {weekOffset === 0 ? '今週' : weekOffset === -1 ? '先週' : `${weekOffset}週後`}
          {' '}({weekLabel})
        </span>
        <button
          onClick={() => setWeekOffset((o) => Math.min(3, o + 1))}
          disabled={weekOffset >= 3}
          className="text-xs px-2 py-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600"
        >
          次週 ›
        </button>
      </div>

      {/* Per-department calendars */}
      <div className="space-y-3">
        {outpatientDepts.map((dept) => {
          const schedule = dept.weeklySchedules
            ? getScheduleForWeekOffset(dept.weeklySchedules, weekOffset)
            : undefined;

          return (
            <div key={dept.id}>
              <p className="text-xs font-semibold text-slate-700 mb-1">{dept.name}</p>
              {schedule ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="bg-slate-50 text-slate-500 font-medium text-left p-1 w-12"></th>
                        {DAY_OF_WEEK_LABELS.map((day, i) => (
                          <th key={i} className="bg-slate-50 text-slate-500 font-medium text-center p-1">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map((ts) => (
                        <tr key={ts}>
                          <td className="text-slate-500 font-medium p-1 whitespace-nowrap">
                            {TIME_SLOT_LABELS[ts]}
                          </td>
                          {schedule.days.map((day, dayIdx) => {
                            const cell = day.slots[ts];
                            const status = getOutpatientSlotStatus(cell);
                            const display = OUTPATIENT_STATUS_DISPLAY[status];
                            return (
                              <td
                                key={dayIdx}
                                className="text-center p-1 font-bold"
                                style={{
                                  color: display.color,
                                  backgroundColor: display.bgColor,
                                }}
                                title={
                                  cell
                                    ? `${cell.totalSlots - cell.bookedSlots}/${cell.totalSlots} 空き`
                                    : '休診'
                                }
                              >
                                {display.symbol}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400">スケジュールデータなし</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        {(['available', 'few', 'full', 'closed'] as const).map((status) => {
          const d = OUTPATIENT_STATUS_DISPLAY[status];
          const labels = { available: '空きあり', few: '残りわずか', full: '満', closed: '休診' };
          return (
            <span key={status} className="flex items-center gap-1">
              <span className="font-bold" style={{ color: d.color }}>{d.symbol}</span>
              {labels[status]}
            </span>
          );
        })}
      </div>

      {/* Non-outpatient departments as tags */}
      {nonOutpatientDepts.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-slate-400 mb-1">外来なし</p>
          <div className="flex flex-wrap gap-1">
            {nonOutpatientDepts.map((dept) => (
              <span
                key={dept.id}
                className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded"
              >
                {dept.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
