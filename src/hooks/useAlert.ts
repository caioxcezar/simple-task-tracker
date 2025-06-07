import AlertContext from "@/contexts/alertContext";
import { type AlertParamsType } from "@/types/alert";
import { useContext } from "react";

const useAlert = () => {
  const context = useContext(AlertContext)!;
  return {
    open: (params: AlertParamsType) => context.open(params),
    close: () => context.close(),
  };
};

export default useAlert;
