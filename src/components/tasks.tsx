import useDb from "@/hooks/useDb";
import Button from "./button";
import Task from "@/components/task";
import { ButtonType } from "@/types/buttonType";
import { Status as StatusDay } from "@/types/dayDto";
import { wrapPromise } from "@/utils/suspense";
import { Suspense, useMemo, useRef, useState } from "react";
import ActivityIndicator from "./activityIndicator";

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
  const [markedTasks, setMarkedTasks] = useState<number[]>([]);
  const _tasks = useRef<Task[]>([]);
  const tasks = _tasks.current;

  const promise = useMemo(
    () => wrapPromise(db.allActiveTasks(date)),
    [date, extra]
  );

  const removeTask = (task: Task) => {
    db.updateTask(task.id, { end: date });
    onAction();
  };

  const setCompleted = async () => {
    const obj = {
      date,
      tasks: tasks.map(({ name }) => name),
      status: StatusDay.COMPLETED,
    };
    updateDay(obj);
  };

  const setPartialCompleted = async () => {
    const obj = {
      date,
      tasks: tasks
        .filter(({ id }) => markedTasks.includes(id))
        .map(({ name }) => name),
      status: StatusDay.PARTIAL,
    };
    updateDay(obj);
  };

  const updateDay = async (obj: {
    date: number;
    tasks: string[];
    status: StatusDay;
  }) => {
    const dbEntry = await db.day(obj.date);
    if (dbEntry) await db.updateDay(dbEntry.id, obj);
    else await db.addDay(obj);
    onAction();
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
    );
  };

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Render />
    </Suspense>
  );
};

export default Tasks;
