export default function ViewToggle({ icon: Icon, view, curr, setView }) {
  return (
    <button
      onClick={() => setView(view)}
      className={`p-2 rounded-md ${
        curr === view
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <Icon />
    </button>
  );
}
