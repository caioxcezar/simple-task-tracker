import { ButtonType } from "./buttonType";

export default interface AlertContextType {
  open: (parms: AlertParamsType) => void;
  close: () => void;
}

export type AlertParamsType = {
  title?: string;
  body?: string;
  options?: AlertOptionType[];
};

export type AlertOptionType = {
  title: string;
  onPress: () => void;
  type: ButtonType;
};
