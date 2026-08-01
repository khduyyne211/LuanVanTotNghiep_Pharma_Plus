import type { ReactNode } from "react";

type TieuDeTrangQuanLyProps = {
  tieuDe: string;
  moTa?: string;
  children?: ReactNode;
};

export default function TieuDeTrangQuanLy({
  tieuDe,
  moTa,
  children,
}: TieuDeTrangQuanLyProps) {
  return (
    <header className="ql-page-header">
      <div className="ql-page-header-content">
        <h1>{tieuDe}</h1>
        {moTa && <span>{moTa}</span>}
      </div>

      {children && (
        <div className="ql-page-header-action">
          {children}
        </div>
      )}
    </header>
  );
}