import { ButtonType } from "@/types/buttonType";

const bgColor = [
  "bg-blue-600 hover:bg-blue-800",
  "bg-green-500 hover:bg-green-700",
  "bg-red-600 hover:bg-red-800",
  "bg-yellow-500 hover:bg-yellow-800",
];

const Button = ({
  title,
  onPress,
  color = ButtonType.PRIMARY,
}: {
  title: string;
  onPress: () => void;
  color?: ButtonType;
}) => {
  const className = `text-white ${bgColor[color]} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`;
  return (
    <button onClick={onPress} className={className}>
      {title}
    </button>
  );
};

export default Button;
