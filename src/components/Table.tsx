import type { ReactNode } from "react";
import SkeletonTable from "./SkeletonTable";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  render?: (value: any, row: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  isLoading?: boolean;
}

function Table<T extends { _id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <SkeletonTable
        columns={columns.length}
        rows={5}
        hasActions={!!(onEdit || onDelete || onView)}
      />
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
        <div className="text-gray-500 text-center">
          <p className="text-lg mb-2">No data available</p>
          <p className="text-sm text-gray-400">
            Start by adding your first item
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden flex flex-col max-h-[calc(100vh-140px)] w-full max-w-[calc(100vw-2rem)] md:max-w-full">
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50 flex-1 w-full">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 z-10 shadow-sm">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider whitespace-nowrap bg-gradient-to-r from-purple-50 to-pink-50"
                  >
                    {column.header}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider bg-pink-50 sticky right-0 z-20 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row._id} className="hover:bg-purple-50 transition-colors">
                  {columns.map((column, index) => {
                    let cellContent: ReactNode;

                    if (typeof column.accessor === "function") {
                      cellContent = column.accessor(row);
                    } else {
                      const value = row[column.accessor];
                      cellContent = column.render
                        ? column.render(value, row)
                        : String(value ?? "");
                    }

                    return (
                      <td
                        key={index}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white group-hover:bg-purple-50 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                      <div className="flex gap-2 justify-start">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="text-teal-600 hover:text-teal-900 p-2 hover:bg-teal-50 rounded transition-colors"
                            title="View"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded transition-colors"
                            title="Edit"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table;

