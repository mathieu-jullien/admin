import type { TableColumn } from './TableColumn';

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc' | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}
