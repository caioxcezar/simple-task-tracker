import useDb from "@/hooks/useDb";
import { wrapPromise } from "@/utils/suspense";
import { Suspense, useMemo } from "react";
import ActivityIndicator from "./activityIndicator";

const TaskDetails = ({ date, extra }: { date: number; extra?: unknown }) => {
  const db = useDb();
  const promise = useMemo(() => wrapPromise(db.day(date)), [date, extra]);

  const Render = () => {
    const task = promise.read();
    if (!task) return <></>;
    return (
      <div>
        <span className="text-xl font-medium">Task completed in this day</span>
        <ul className="pl-5 list-disc">
          {task.tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Render />
    </Suspense>
  );
};

export default TaskDetails;
