import useDb from "@/hooks/useDb";
import Button from "./button";
import Task from "@/components/task";
import { ButtonType } from "@/types/buttonType";
import { wrapPromise } from "@/utils/suspense";
import { Suspense, useMemo, useRef, useState } from "react";
import ActivityIndicator from "./activityIndicator";
import { DayStatusType } from "@/types/day";
import { toast } from "react-toastify";
import useAlert from "@/hooks/useAlert";
import { AlertParamsType } from "@/types/alert";
import { DateTime } from "luxon";
import { now } from "@/utils/date";

const Tasks = ({
  date,
  onAction,
  extra,
}: {
  date: number;
  onAction: () => void;
  extra?: unknown;
}) => {
  const db = useDb();
  const alert = useAlert();

  const [markedTasks, setMarkedTasks] = useState<number[]>([]);
  const _tasks = useRef<Task[]>([]);
  const tasks = _tasks.current;

  const promise = useMemo(
    () => wrapPromise(db.allActiveTasks(date)),
    [date, extra]
  );

  const removeTask = (task: Task) => {
    const remove = (end: number) => {
      try {
        db.updateTask(task.id, { end });
        onAction();
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    const params: AlertParamsType = {
      title: "Before Removing",
      body:
        'The task "' +
        task.name +
        '" will be marked as removed in the day ' +
        DateTime.fromMillis(date).toLocaleString(DateTime.DATE_SHORT) +
        ". Are You sure?",
      options: [],
    };
    params.options!.push({
      title: "Yes",
      onPress: () => remove(date),
      type: ButtonType.SUCCESS,
    });
    const today = now().toMillis();
    if (date !== today)
      params.options!.push({
        title: "Remove today",
        onPress: () => remove(today),
        type: ButtonType.PRIMARY,
      });
    params.options!.push({
      title: "No",
      onPress: alert.close,
      type: ButtonType.DANGER,
    });

    alert.open(params);
  };

  const setCompleted = (isPartial: boolean) => {
    const setCompleted = async (date: number) => {
      const obj = {
        date,
        tasks: tasks.map(({ name }) => name),
        status: DayStatusType.COMPLETED,
      };
      updateDay(obj);
    };

    const setPartialCompleted = async (date: number) => {
      const obj = {
        date,
        tasks: tasks
          .filter(({ id }) => markedTasks.includes(id))
          .map(({ name }) => name),
        status: DayStatusType.PARTIAL,
      };
      updateDay(obj);
    };

    const params: AlertParamsType = {
      title: "Before Completing",
      body:
        "The completion will be set for the day " +
        DateTime.fromMillis(date).toLocaleString(DateTime.DATE_SHORT) +
        ". Are You sure?",
      options: [],
    };
    params.options!.push({
      title: "Yes",
      onPress: () =>
        isPartial ? setCompleted(date) : setPartialCompleted(date),
      type: ButtonType.SUCCESS,
    });
    const today = now().toMillis();
    if (date !== today)
      params.options!.push({
        title: "Mark today",
        onPress: () =>
          isPartial ? setCompleted(today) : setPartialCompleted(today),
        type: ButtonType.PRIMARY,
      });
    params.options!.push({
      title: "No",
      onPress: alert.close,
      type: ButtonType.DANGER,
    });

    alert.open(params);
  };

  const updateDay = async (obj: {
    date: number;
    tasks: string[];
    status: DayStatusType;
  }) => {
    try {
      const dbEntry = await db.day(obj.date);
      if (dbEntry) await db.updateDay(dbEntry.id, obj);
      else await db.addDay(obj);
      onAction();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const markTask = ({ id }: Task, checked: boolean) => {
    if (checked) setMarkedTasks([...markedTasks, id]);
    else setMarkedTasks(markedTasks.filter((taskId) => taskId !== id));
  };

  const Render = () => {
    const tasks = promise.read();
    if (!tasks) return <></>;
    _tasks.current = tasks;
    return (
      <div className="grid gap-2">
        <div>
          <span className="text-sm">Daily tasks completed? </span>
          <div className="flex gap-2">
            <Button
              title="All Completed"
              onPress={() => setCompleted(false)}
              color={ButtonType.SUCCESS}
            />
            <Button
              title="Only Checked"
              onPress={() => setCompleted(true)}
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
    );
  };

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Render />
    </Suspense>
  );
};

export default Tasks;
