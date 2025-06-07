import { DayStatusType } from "./day";

export default interface DayTypeDto {
  date: number;
  status: DayStatusType;
  tasks: string[];
}
