const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <input
      id="default-checkbox"
      type="checkbox"
      checked={checked}
      onChange={() => onChange(!checked)}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
    />
  );
};

export default Checkbox;
