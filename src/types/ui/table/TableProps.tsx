import type { TableColumn } from './TableColumn';

export interface TableActions<T> {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  canEdit?: boolean | ((row: T) => boolean);
  canDelete?: boolean | ((row: T) => boolean);
  editLabel?: string;
  deleteLabel?: string;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: (row: T) => string;
}

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
  actions?: TableActions<T>;
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
