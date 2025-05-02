import { useRef } from "react";
import {
  Dexie,
  type UpdateSpec,
  type EntityTable,
  type InsertType,
} from "dexie";
import type Day from "@/types/day";
import type Task from "@/types/task";
import type TaskDto from "@/types/taskDto";
import DayDto from "@/types/dayDto";
import { exportDB, importInto } from "dexie-export-import";

const load = () => {
  const db = new Dexie("Database") as Dexie & {
    days: EntityTable<Day, "id">;
    tasks: EntityTable<Task, "id">;
  };
  db.version(1).stores({
    days: "++id, date",
    tasks: "++id, start, end",
  });
  return db;
};

const getFile = (): Promise<File> =>
  new Promise((resolve, reject) => {
    const element = document.createElement("input");
    element.type = "file";
    element.click();
    element.addEventListener("change", () => {
      if (element.files?.length) return resolve(element.files[0]);
      element.remove();
      reject(new Error("No file selected"));
    });
  });

const useDb = () => {
  const db = useRef(load()).current;
  return {
    addDay: (day: DayDto) => db.days.put(day),
    updateDay: (
      key: number | Day,
      changes: UpdateSpec<InsertType<Day, "id">>
    ) => db.days.update(key, changes),
    addTask: (task: TaskDto) => db.tasks.put(task),
    day: async (date: number) => db.days.where("date").equals(date).first(),
    updateTask: (
      key: number | Task,
      changes: UpdateSpec<InsertType<Task, "id">>
    ) => db.tasks.update(key, changes),
    allActiveTasks: (date: number) => {
      return db.tasks
        .where("start")
        .belowOrEqual(date)
        .filter((task) => !task.end || task.end > date)
        .toArray();
    },
    allDays: () => db.days.toArray(),
    import: async () => {
      const blob = await getFile();

      await importInto(db, blob, {
        overwriteValues: true,
        clearTablesBeforeImport: true,
      });
    },
    export: async () => {
      const blob = await exportDB(db);
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = "database.json";
      element.click();
      element.remove();
    },
  };
};

export default useDb;
