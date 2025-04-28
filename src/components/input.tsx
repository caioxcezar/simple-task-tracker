const Input = ({
  value,
  onChange = () => {},
}: {
  value?: string | number;
  onChange?: (value: string) => void;
}) => {
  return (
    <input
      type="text"
      value={value}
      className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      onChange={({ target: { value } }) => onChange(value)}
    />
  );
};

export default Input;
