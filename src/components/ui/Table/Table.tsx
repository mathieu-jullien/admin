import { useState, useMemo } from 'react';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import type { TableProps, SortState } from '../../../types/ui/table/TableProps';
import { ConfirmModal } from '../Modal';

export default function Table<T = Record<string, unknown>>({
  data,
  columns,
  title,
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
  onRowClick,
  sortable = false,
  pagination = false,
  pageSize = 10,
  className = '',
  actions,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({
    column: '',
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    row: T | null;
  }>({ isOpen: false, row: null });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortable || !sortState.column || !sortState.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = a[sortState.column as keyof T];
      const bVal = b[sortState.column as keyof T];

      if (aVal < bVal) return sortState.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortState, sortable]);

  // Pagination des données
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    setSortState(prev => {
      if (prev.column !== columnKey) {
        return { column: columnKey, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { column: columnKey, direction: 'desc' };
      }
      return { column: '', direction: null };
    });
  };

  const handleRowClick = (row: T, index: number) => {
    // Don't trigger row click if actions are enabled
    if (actions) return;
    onRowClick?.(row, index);
  };

  const handleEdit = (e: React.MouseEvent, row: T) => {
    e.stopPropagation();
    actions?.onEdit?.(row);
  };

  const handleDeleteClick = (e: React.MouseEvent, row: T) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, row });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.row || !actions?.onDelete) return;

    const rowId = (deleteModal.row as unknown as { id: number }).id;
    setDeletingId(rowId);

    try {
      await actions.onDelete(deleteModal.row);
    } finally {
      setDeletingId(null);
      setDeleteModal({ isOpen: false, row: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, row: null });
  };

  const canEditRow = (row: T): boolean => {
    if (!actions?.canEdit) return true;
    return typeof actions.canEdit === 'function'
      ? actions.canEdit(row)
      : actions.canEdit;
  };

  const canDeleteRow = (row: T): boolean => {
    if (!actions?.canDelete) return true;
    return typeof actions.canDelete === 'function'
      ? actions.canDelete(row)
      : actions.canDelete;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {title && (
          <div className="bg-gray-800 text-white border-b-2 border-gray-600 p-4 h-16 flex items-center">
            <div className="h-6 bg-gray-600 rounded w-48"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table
            className={`min-w-full bg-white border border-gray-200 ${className}`}
          >
            <thead className="bg-gray-50">
              <tr>
                {columns.map((_, index) => (
                  <th key={index} className="px-6 py-3 border-b">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 border-b">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {title && (
        <div className="bg-gray-800 text-white border-b-2 border-gray-600 p-4 h-16 flex items-center justify-center">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}

      <div className="">
        <table
          className={`min-w-full bg-white border border-gray-200 ${className}`}
        >
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${
                    sortable && column.sortable
                      ? 'cursor-pointer hover:bg-gray-100'
                      : ''
                  } ${column.className || ''}`}
                  style={column.width ? { width: column.width } : {}}
                  onClick={() =>
                    column.sortable && handleSort(String(column.key))
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && column.sortable && (
                      <span className="ml-2">
                        {sortState.column === String(column.key)
                          ? sortState.direction === 'asc'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = (row as unknown as { id: number }).id;
                const isDeleting = deletingId === rowId;

                return (
                  <tr
                    key={rowIndex}
                    className={`${
                      onRowClick && !actions
                        ? 'hover:bg-gray-50 cursor-pointer'
                        : ''
                    } ${isDeleting ? 'opacity-50' : ''}`}
                    onClick={() => handleRowClick(row, rowIndex)}
                  >
                    {columns.map(column => (
                      <td
                        key={String(column.key)}
                        className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                      >
                        {column.render
                          ? column.render(row[column.key], row, rowIndex)
                          : String(row[column.key])}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <div className="flex items-center justify-end space-x-2">
                          {actions.onEdit && canEditRow(row) && (
                            <button
                              onClick={e => handleEdit(e, row)}
                              disabled={isDeleting}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition p-1 rounded hover:bg-blue-50"
                              aria-label={
                                actions.editLabel || 'Éditer cette ligne'
                              }
                              title={actions.editLabel || 'Éditer'}
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          {actions.onDelete && canDeleteRow(row) && (
                            <button
                              onClick={e => handleDeleteClick(e, row)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition p-1 rounded hover:bg-red-50 flex items-center"
                              aria-label={
                                actions.deleteLabel || 'Supprimer cette ligne'
                              }
                              title={actions.deleteLabel || 'Supprimer'}
                            >
                              {isDeleting ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de{' '}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>{' '}
                à{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, sortedData.length)}
                </span>{' '}
                sur <span className="font-medium">{sortedData.length}</span>{' '}
                résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        isCurrentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {actions?.onDelete && deleteModal.row && (
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          title={actions.deleteConfirmTitle || 'Confirmer la suppression'}
          message={
            actions.deleteConfirmMessage
              ? actions.deleteConfirmMessage(deleteModal.row)
              : 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'
          }
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          loading={deletingId !== null}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}
