export default function IconButton({ title, onClick, icon: Icon, className }) {
  return (
    <button title={title} onClick={onClick} className={className}>
      <Icon />
    </button>
  );
}
