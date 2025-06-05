"use client";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/button";
import Calendar from "@/components/calendar";
import Input from "@/components/input";
import useDb from "@/hooks/useDb";
import { DateTime } from "luxon";
import Day from "@/types/day";
import { ToastContainer } from "react-toastify";
import TaskDetails from "@/components/taskDetails";
import { now } from "@/utils/date";
import DbActions from "@/components/dbActions";
import Tasks from "@/components/tasks";

export default function Home() {
  const db = useDb();

  const [days, setDays] = useState<Day[]>([]);
  const [value, setValue] = useState("");
  const [date, setCurrentDay] = useState(now().toMillis());

  const [extraTasks, _refreshTasks] = useState(1);
  const [extraDetails, _refreshDetails] = useState(1);

  const refreshTasks = () => _refreshTasks((prev) => prev + 1);
  const refreshDetails = () => _refreshDetails((prev) => prev + 1);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    await loadDays();
  };

  const loadDays = async () => {
    setDays(await db.allDays());
  };

  const addTask = () => {
    if (!value.trim()) return;
    db.addTask({ name: value, start: date });
    refreshTasks();
  };

  const changeDay = (date: DateTime) => {
    setCurrentDay(date.startOf("day").toMillis());
  };

  const onTasksAction = () => {
    refreshTasks();
    refreshDetails();
    loadDays();
  };

  const strDate = useMemo(
    () => DateTime.fromMillis(date).toLocaleString(DateTime.DATE_SHORT),
    [date]
  );

  return (
    <div>
      <div className="flex flex-col xl:flex-row gap-2">
        <div>
          <div className="text-center text-2xl">{strDate}</div>
          <Calendar onPress={changeDay} dates={days} />
          <TaskDetails date={date} extra={extraDetails} />
        </div>
        <div className="flex-grow">
          <div className="text-center text-2xl">Add task</div>
          <div className="text-center text-sm">Task name</div>
          <div className="flex flex-row gap-2">
            <Input value={value} onChange={setValue} />
            <Button title="Add" onPress={addTask} />
          </div>
        </div>
        <div className="xl:w-1/2 w-full">
          <div className="xl:overflow-auto xl:h-dvh">
            <span className="text-center text-2xl">Daily tasks</span>
            <Tasks date={date} onAction={onTasksAction} extra={extraTasks} />
          </div>
        </div>
      </div>
      <div>
        <DbActions onAction={onLoad} />
      </div>
      <ToastContainer />
    </div>
  );
}
