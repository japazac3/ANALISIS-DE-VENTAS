import React from 'react';
import { Filter, X } from 'lucide-react';
import { DashboardFilters } from '../types';
import { cn } from '../lib/utils';

interface FiltersProps {
  filters: DashboardFilters;
  options: {
    countries: string[];
    channels: string[];
    sellers: string[];
    products: string[];
    paymentMethods: string[];
  };
  onFilterChange: (filters: DashboardFilters) => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, options, onFilterChange }) => {
  const toggleOption = (key: keyof Omit<DashboardFilters, 'dateRange'>, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: next });
  };

  const clearFilters = () => {
    onFilterChange({
      dateRange: { start: '', end: '' },
      countries: [],
      channels: [],
      sellers: [],
      products: [],
      paymentMethods: [],
    });
  };

  const FilterSection = ({ title, options, filterKey }: { title: string, options: string[], filterKey: keyof Omit<DashboardFilters, 'dateRange'> }) => (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => toggleOption(filterKey, option)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
              (filters[filterKey] as string[]).includes(option)
                ? "bg-primary border-primary text-white shadow-md shadow-pink-100"
                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="glass-card p-6 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-widest">
          <Filter size={16} className="text-primary" />
          <span>Filtros de Análisis</span>
        </div>
        <button
          onClick={clearFilters}
          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-pink-600 flex items-center gap-1 transition-colors"
        >
          <X size={12} />
          Limpiar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Periodo</h4>
          <div className="flex flex-col gap-2">
            <input 
              type="date" 
              value={filters.dateRange.start}
              onChange={(e) => onFilterChange({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-primary transition-all"
            />
            <input 
              type="date" 
              value={filters.dateRange.end}
              onChange={(e) => onFilterChange({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-primary transition-all"
            />
          </div>
        </div>
        <FilterSection title="País" options={options.countries} filterKey="countries" />
        <FilterSection title="Canal" options={options.channels} filterKey="channels" />
        <FilterSection title="Vendedor" options={options.sellers} filterKey="sellers" />
        <FilterSection title="Producto" options={options.products} filterKey="products" />
        <FilterSection title="Forma de Pago" options={options.paymentMethods} filterKey="paymentMethods" />
      </div>
    </div>
  );
};
