type NutThaoTacChinhProps = {
  nhan: string;
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

export default function NutThaoTacChinh({
  nhan,
  onClick,
  icon = "bi bi-plus-lg",
  disabled = false,
  type = "button",
}: NutThaoTacChinhProps) {
  return (
    <button
      type={type}
      className="ql-button ql-button-primary"
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={icon} />}
      <span>{nhan}</span>
    </button>
  );
}