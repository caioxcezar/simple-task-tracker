"use client";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/button";
import Calendar from "@/components/calendar";
import Input from "@/components/input";
import useDb from "@/hooks/useDb";
import { DateTime } from "luxon";
import type DayType from "@/types/day";
import TaskDetails from "@/components/taskDetails";
import { now } from "@/utils/date";
import DbActions from "@/components/dbActions";
import Tasks from "@/components/tasks";
import { toast } from "react-toastify";
import useAlert from "@/hooks/useAlert";
import { AlertParamsType } from "@/types/alert";
import { ButtonType } from "@/types/buttonType";

export default function Home() {
  const db = useDb();
  const alert = useAlert();

  const [days, setDays] = useState<DayType[]>([]);
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
    try {
      setDays(await db.allDays());
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const addTask = () => {
    const name = value.trim();
    if (!name) return;

    const save = (start: number) => {
      try {
        db.addTask({ name, start });
        refreshTasks();
        setValue("");
        const str = DateTime.fromMillis(date).toLocaleString(
          DateTime.DATE_SHORT
        );
        toast.success(`Task saved in the day ${str} successfully`);
        alert.close();
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    const params: AlertParamsType = {
      title: "Before Saving",
      body:
        'The task "' +
        name +
        '" will be saved in the day ' +
        DateTime.fromMillis(date).toLocaleString(DateTime.DATE_SHORT) +
        ". Are You sure?",
      options: [],
    };
    params.options!.push({
      title: "Yes",
      onPress: () => save(date),
      type: ButtonType.SUCCESS,
    });
    const today = now().toMillis();
    if (date !== today)
      params.options!.push({
        title: "Save today",
        onPress: () => save(today),
        type: ButtonType.PRIMARY,
      });
    params.options!.push({
      title: "No",
      onPress: alert.close,
      type: ButtonType.DANGER,
    });
    alert.open(params);
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
    </div>
  );
}
