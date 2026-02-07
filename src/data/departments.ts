import { Department } from '@/types';

export const DEPARTMENT_MASTER: Omit<Department, 'outpatientSlots'>[] = [
  { id: 'naika', name: '内科', hasOutpatient: true },
  { id: 'geka', name: '外科', hasOutpatient: true },
  { id: 'seikei', name: '整形外科', hasOutpatient: true },
  { id: 'shoni', name: '小児科', hasOutpatient: true },
  { id: 'sanfujinka', name: '産婦人科', hasOutpatient: true },
  { id: 'nouge', name: '脳神経外科', hasOutpatient: true },
  { id: 'junkanki', name: '循環器内科', hasOutpatient: true },
  { id: 'seishin', name: '精神科', hasOutpatient: true },
  { id: 'hinyoki', name: '泌尿器科', hasOutpatient: true },
  { id: 'hifuka', name: '皮膚科', hasOutpatient: true },
  { id: 'ganka', name: '眼科', hasOutpatient: true },
  { id: 'jibi', name: '耳鼻咽喉科', hasOutpatient: true },
  { id: 'riha', name: 'リハビリテーション科', hasOutpatient: true },
  { id: 'kyukyu', name: '救急科', hasOutpatient: false },
  { id: 'masui', name: '麻酔科', hasOutpatient: false },
];
