import { Button } from "@/components/ui/button";

const PAGE_SIZES = [10, 25, 50];

type Props = {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
};

export function TablePagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
  onPageSize,
}: Props) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span>{total} resultados</span>
      <div className="flex items-center gap-3">
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="rounded-md border bg-transparent px-2 py-1"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s} className="text-black">
              {s} por página
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="outline"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
        >
          Anterior
        </Button>
        <span>
          {page + 1} / {pageCount}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= pageCount - 1}
          onClick={() => onPage(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
