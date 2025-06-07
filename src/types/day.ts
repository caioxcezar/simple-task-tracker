export default interface DayType {
  id: number;
  date: number;
  status: DayStatusType;
  tasks: string[];
}

export enum DayStatusType {
  INCOMPLETED,
  COMPLETED,
  PARTIAL,
}
