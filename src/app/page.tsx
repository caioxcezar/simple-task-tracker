"use client";
import { useEffect, useState } from "react";
import Button from "@/components/button";
import Calendar from "@/components/calendar";
import Input from "@/components/input";
import Task from "@/components/task";
import useDb from "@/hooks/useDb";
import { DateTime } from "luxon";
import { Status as StatusDay } from "@/types/dayDto";
import { ButtonType } from "@/types/buttonType";
import Day from "@/types/day";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

const now = () => DateTime.now().startOf("day");
export default function Home() {
  const db = useDb();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [value, setValue] = useState("");
  const [currentDay, setCurrentDay] = useState(now());
  const [markedTasks, setMarkedTasks] = useState<number[]>([]);
  const [taskDay, setTaskDay] = useState<Day | undefined>();

  useEffect(() => {
    (async () => setTaskDay(await db.day(currentDay.toMillis())))();
  }, [currentDay]);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = () => Promise.all([loadTasks(), loadDays()]);

  const loadTasks = async () => {
    const tasks = await db.allActiveTasks(currentDay.toMillis());
    setTasks(tasks);
  };

  const loadDays = async () => {
    setDays(await db.allDays());
  };

  const addTask = () => {
    if (!value.trim()) return;
    db.addTask({ name: value, start: now().toMillis() });
    loadTasks();
  };

  const removeTask = (task: Task) => {
    db.updateTask(task.id, { end: now().toMillis() });
    loadTasks();
  };

  const changeDay = (date: DateTime) => {
    setCurrentDay(date);
    loadTasks();
  };

  const setCompleted = async () => {
    const obj = {
      date: currentDay.toMillis(),
      tasks: tasks.map(({ name }) => name),
      status: StatusDay.COMPLETED,
    };
    updateDay(obj);
  };

  const setPartialCompleted = async () => {
    const obj = {
      date: currentDay.toMillis(),
      tasks: tasks
        .filter(({ id }) => markedTasks.includes(id))
        .map(({ name }) => name),
      status: StatusDay.PARTIAL,
    };
    updateDay(obj);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateDay = async (obj: any) => {
    const dbEntry = await db.day(obj.date);
    if (dbEntry) await db.updateDay(dbEntry.id, obj);
    else await db.addDay(obj);
    loadDays();
  };

  const markTask = ({ id }: Task, checked: boolean) => {
    if (checked) setMarkedTasks([...markedTasks, id]);
    else setMarkedTasks(markedTasks.filter((taskId) => taskId !== id));
  };

  return (
    <div>
      <div className="flex flex-col xl:flex-row gap-2">
        <div>
          <Calendar onPress={changeDay} dates={days} />
          {taskDay && (
            <div>
              <span className="text-xl font-medium">
                Task completed day{" "}
                {DateTime.fromMillis(taskDay.date).toLocaleString(
                  DateTime.DATETIME_SHORT
                )}
                :
              </span>
              <ul className="pl-5 list-disc">
                {taskDay.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div>
            <span className="block mb-2 text-2xl font-medium">Add task</span>
            <span className="block mb-2 text-sm font-medium">Task name</span>
            <div className="flex flex-row gap-2">
              <Input value={value} onChange={setValue} />
              <Button title="Add" onPress={addTask} />
            </div>
          </div>
        </div>
        <div className="xl:w-1/2 w-full">
          <div className="xl:overflow-auto xl:h-dvh">
            <span className="text-2xl">Daily tasks</span>
            <div className="grid gap-2">
              <div>
                <span className="text-sm">Daily tasks completed? </span>
                <div className="flex gap-2">
                  <Button
                    title="All Completed"
                    onPress={setCompleted}
                    color={ButtonType.SUCCESS}
                  />
                  <Button
                    title="Only Checked"
                    onPress={setPartialCompleted}
                    color={ButtonType.WARNING}
                  />
                </div>
              </div>
              {tasks.map((task) => (
                <Task
                  onChange={(checked) => markTask(task, checked)}
                  checked={markedTasks.includes(task.id)}
                  key={task.id}
                  task={task}
                  onRemove={removeTask}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="absolute bottom-0 right-0 m-2 flex gap-2">
          <Image
            src="upload.svg"
            width={50}
            height={50}
            alt="Upload DataBase"
            onClick={() =>
              db
                .import()
                .then(onLoad)
                .then(() => toast.success("Uploaded"))
                .catch((err) => toast.error(err.Message))
            }
          />
          <Image
            src="download.svg"
            width={50}
            height={50}
            alt="Download DataBase"
            onClick={() =>
              db
                .export()
                .then(() => toast.success("Downloaded"))
                .catch((err) => toast.error(err.Message))
            }
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
