export default interface Day {
  id: number;
  date: number;
  status: Status;
  tasks: string[];
}

enum Status {
  INCOMPLETED,
  COMPLETED,
  PARTIAL,
}
