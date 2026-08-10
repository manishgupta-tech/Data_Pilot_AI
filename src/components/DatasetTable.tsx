import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Hash, Type, Calendar, ToggleLeft, Filter } from 'lucide-react';
import { ColumnInfo } from '../types';

interface DatasetTableProps {
  columns: ColumnInfo[];
  data: Record<string, any>[];
  pageSize?: number;
}

export const DatasetTable: React.FC<DatasetTableProps> = ({ columns, data, pageSize = 8 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
        return <Hash className="w-3 h-3 text-cyan-400" />;
      case 'date':
        return <Calendar className="w-3 h-3 text-emerald-400" />;
      case 'boolean':
        return <ToggleLeft className="w-3 h-3 text-purple-400" />;
      default:
        return <Type className="w-3 h-3 text-slate-400" />;
    }
  };

  const handleSort = (colName: string) => {
    if (sortColumn === colName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colName);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(term))
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, searchTerm, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  return (
    <div className="bg-[#161820] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
      {/* Table Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search dataset rows..."
            className="w-full bg-[#111318] border border-white/10 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 self-end sm:self-auto">
          <span>
            Showing <strong className="text-white">{paginatedData.length}</strong> of{' '}
            <strong className="text-white">{filteredAndSortedData.length}</strong> rows
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111318]">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#1B1E28] text-slate-300 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10">
            <tr>
              {columns.map((col) => (
                <th key={col.name} className="px-3 py-2.5 whitespace-nowrap">
                  <button
                    onClick={() => handleSort(col.name)}
                    className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors font-mono"
                  >
                    {getTypeIcon(col.dataType)}
                    <span>{col.name}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-cyan-500/5 transition-colors font-mono">
                  {columns.map((col) => {
                    const value = row[col.name];
                    const isNull = value === null || value === undefined || value === '';
                    return (
                      <td key={col.name} className="px-3 py-2 whitespace-nowrap">
                        {isNull ? (
                          <span className="text-[10px] italic text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">NULL</span>
                        ) : typeof value === 'boolean' ? (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              value ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {String(value)}
                          </span>
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 font-mono text-xs">
                  No matching dataset records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400 font-mono">
        <span>
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
