import { useState, useMemo } from 'react';
import type { TableProps, SortState } from '../../../types/ui/table/TableProps';

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
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({
    column: '',
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

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
    onRowClick?.(row, index);
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
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''
                  }`}
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
                </tr>
              ))
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
    </div>
  );
}
