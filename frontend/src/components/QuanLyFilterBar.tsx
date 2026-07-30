type ThanhTimKiemProps = {
  giaTri: string;
  onThayDoi: (giaTri: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

function ThanhTimKiem({
  giaTri,
  onThayDoi,
  placeholder = "Nhập từ khóa tìm kiếm...",
  disabled = false,
}: ThanhTimKiemProps) {
  return (
    <div className="search-bar">
      <i className="bi bi-search search-icon" />

      <input
        type="text"
        value={giaTri}
        onChange={(event) => onThayDoi(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />

      {giaTri && (
        <button
          type="button"
          className="search-clear-button"
          onClick={() => onThayDoi("")}
          disabled={disabled}
          aria-label="Xóa từ khóa tìm kiếm"
        >
          <i className="bi bi-x-lg" />
        </button>
      )}
    </div>
  );
}

export default ThanhTimKiem;