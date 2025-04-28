const Badge = ({ color }: { color: string }) => {
  return (
    <div
      className={`p-2 shadow-md no-underline rounded-full text-white font-sans font-semibold text-sm border-red btn-primary ${color}`}
    ></div>
  );
};

export default Badge;
