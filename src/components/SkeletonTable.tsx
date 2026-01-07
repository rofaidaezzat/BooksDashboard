interface SkeletonTableProps {
  columns: number;
  rows?: number;
  hasActions?: boolean;
}

const SkeletonTable = ({
  columns,
  rows = 5,
  hasActions = true,
}: SkeletonTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-pink-50 to-rose-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-pink-50 transition-colors">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {/* For first column, sometimes show image skeleton */}
                      {colIndex === 0 && rowIndex % 3 === 0 && (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                      )}
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                        {rowIndex % 2 === 0 && (
                          <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTable;
