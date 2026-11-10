import { useMemo, useState } from "react";

export function usePagination<T>(rows: T[], initialSize = 10) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialSize);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount - 1); // si se achica la lista, no queda en una página vacía

  const pageRows = useMemo(
    () => rows.slice(current * pageSize, (current + 1) * pageSize),
    [rows, current, pageSize],
  );

  return {
    pageRows,
    paginationProps: {
      page: current,
      pageCount,
      total: rows.length,
      pageSize,
      onPage: setPage,
      onPageSize: (size: number) => {
        setPageSize(size);
        setPage(0);
      },
    },
  };
}
