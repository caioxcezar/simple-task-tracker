import Button from "./button";
import type Task from "@/types/task";
import { DateTime } from "luxon";
import Checkbox from "./checkbox";
import { ButtonType } from "@/types/buttonType";

const Task = ({
  task,
  checked,
  onRemove,
  onChange,
}: {
  task: Task;
  checked: boolean;
  onRemove: (task: Task) => void;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <div className="flex p-6 bg-zinc-500 rounded-lg shadow-sm gap-2">
      <div className="flex items-center justify-center">
        <Checkbox checked={checked} onChange={onChange} />
      </div>
      <div className="flex-grow flex flex-col">
        <label className="text-xl">{task.name}</label>
        <label className="text-sm">
          {DateTime.fromMillis(task.start).toLocaleString(DateTime.DATE_SHORT)}
        </label>
      </div>

      <div className="flex justify-center items-center">
        <Button
          title="Remove"
          onPress={() => onRemove(task)}
          color={ButtonType.DANGER}
        />
      </div>
    </div>
  );
};

export default Task;
