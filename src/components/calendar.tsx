"use client";
import React, { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import Badge from "./badge";
import Day from "@/types/day";
import { Status as StatusDay } from "@/types/dayDto";

const Calendar = ({
  dates = [],
  onPress = () => {},
}: {
  dates?: Day[];
  onPress?: (day: DateTime) => void;
}) => {
  const [date, setDate] = useState(DateTime.now());
  useEffect(() => {
    setInterval(() => setDate(DateTime.now()), 1000 * 60);
  }, []);

  const strDate = useMemo(
    () => date.toLocaleString(DateTime.DATETIME_SHORT),
    [date]
  );

  const grid = useMemo(() => {
    const _grid = [];
    const start = date.startOf("month");
    let days = -start.weekday;

    for (let week = 0; week < 6; week++) {
      const row = [];
      for (let dayWeek = 0; dayWeek < 7; dayWeek++) {
        const currentDate = start.plus({ days });

        let color = "bg-zinc-800";
        if (currentDate.month === start.month)
          if (date.day === currentDate.day) color = "bg-blue-500";
          else color = "bg-zinc-500";

        let badgeColor = "bg-red-500";
        const taskDay = dates.find((day) =>
          currentDate.hasSame(DateTime.fromMillis(day.date), "day")
        );
        if (taskDay)
          if (taskDay.status === StatusDay.COMPLETED)
            badgeColor = "bg-green-500";
          else if (taskDay.status === StatusDay.PARTIAL)
            badgeColor = "bg-yellow-500";

        row.push(
          <div
            key={`${week}:${dayWeek}`}
            className={`relative m-1 flex h-14 w-14 items-center justify-center rounded-lg hover:bg-zinc-600 cursor-pointer ${color}`}
            onClick={() => onPress(currentDate)}
          >
            {currentDate.day}
            <div className="absolute bottom-0 right-0 m-1">
              <Badge color={badgeColor} />
            </div>
          </div>
        );
        days++;
      }

      _grid.push(
        <div key={week} className="flex flex-row">
          {row}
        </div>
      );
    }

    return _grid;
  }, [date, onPress, dates]);

  const week = useMemo(
    () => (
      <div className="flex flex-row">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((value) => (
          <div
            key={value}
            className="m-1 flex h-14 w-14 items-center justify-center"
          >
            {value}
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <div>
      <span className="text-2xl">{strDate}</span>
      {week}
      {grid}
    </div>
  );
};

export default Calendar;
