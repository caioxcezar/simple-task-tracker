"use client";
import React, { createContext, ReactNode, useRef, useState } from "react";
import AlertContextType, {
  AlertParamsType,
  type AlertOptionType,
} from "@/types/alert";
import Button from "@/components/button";

const AlertContext = createContext<AlertContextType | undefined>(undefined);
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("Alert");
  const [body, setBody] = useState("");
  const [options, setOptions] = useState<AlertOptionType[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const open = (params: AlertParamsType) => {
    setTitle(params.title ?? title);
    setBody(params.body ?? body);
    setOptions(params.options ?? options);
    setVisible(true);
  };

  const close = () => setVisible(false);

  const onClickOut = ({
    target,
  }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (target === containerRef.current) close();
  };

  return (
    <AlertContext.Provider value={{ open, close }}>
      {visible && (
        <div
          ref={containerRef}
          className="absolute w-full h-full bg-black/75 top-0 flex justify-center"
          onClick={onClickOut}
        >
          <div className="w-1/4 h-1/4 bg-blue-950 rounded-xl m-auto flex flex-col">
            <div className="text-5xl m-2">{title}</div>
            <div className="mt-2 flex-1 ml-2 mr-2">{body}</div>
            <div className="flex gap-2 m-2 justify-end">
              {options.map((op) => (
                <Button
                  key={title}
                  title={op.title}
                  onPress={op.onPress}
                  color={op.type}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {children}
    </AlertContext.Provider>
  );
};
export default AlertContext;
