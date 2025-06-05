import { DateTime } from "luxon";

export const now = () => DateTime.now().startOf("day");
