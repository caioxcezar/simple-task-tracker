export default interface DayDto {
  date: number;
  status: Status;
  tasks: string[];
}

export enum Status {
  INCOMPLETED,
  COMPLETED,
  PARTIAL,
}
