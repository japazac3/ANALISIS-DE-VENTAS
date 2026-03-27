import React, { useState, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { Filters } from './components/Filters';
import { KPIStats } from './components/KPIStats';
import { Charts } from './components/Charts';
import { SalesData, DashboardFilters } from './types';
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  Download, 
  RefreshCcw, 
  PieChart as PieChartIcon, 
  Table as TableIcon,
  Settings,
  Bell,
  Search,
  User,
  Layers,
  Box,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`sidebar-item ${active ? 'active' : ''}`}>
    <Icon size={18} />
    <span className="text-sm font-semibold">{label}</span>
  </div>
);

export default function App() {
  const [data, setData] = useState<SalesData[] | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: { start: '', end: '' },
    countries: [],
    channels: [],
    sellers: [],
    products: [],
    paymentMethods: [],
  });

  const options = useMemo(() => {
    if (!data) return null;
    return {
      countries: Array.from(new Set(data.map(d => d.País))).sort(),
      channels: Array.from(new Set(data.map(d => d.Canal))).sort(),
      sellers: Array.from(new Set(data.map(d => d.Vendedor))).sort(),
      products: Array.from(new Set(data.map(d => d.Producto))).sort(),
      paymentMethods: Array.from(new Set(data.map(d => d['Formato de pago']))).sort(),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(d => {
      const matchCountry = filters.countries.length === 0 || filters.countries.includes(d.País);
      const matchChannel = filters.channels.length === 0 || filters.channels.includes(d.Canal);
      const matchSeller = filters.sellers.length === 0 || filters.sellers.includes(d.Vendedor);
      const matchProduct = filters.products.length === 0 || filters.products.includes(d.Producto);
      const matchPayment = filters.paymentMethods.length === 0 || filters.paymentMethods.includes(d['Formato de pago']);
      
      let matchDate = true;
      if (filters.dateRange.start) {
        matchDate = matchDate && d.Fecha >= new Date(filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        matchDate = matchDate && d.Fecha <= new Date(filters.dateRange.end);
      }

      return matchCountry && matchChannel && matchSeller && matchProduct && matchPayment && matchDate;
    });
  }, [data, filters]);

  const stats = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + curr.Ventas, 0);
    const totalQuantity = filteredData.reduce((acc, curr) => acc + curr.Cantidad, 0);
    const uniqueCustomers = new Set(filteredData.map(d => d.Cliente)).size;
    const avgOrderValue = filteredData.length > 0 ? totalSales / filteredData.length : 0;

    return { totalSales, totalQuantity, uniqueCustomers, avgOrderValue };
  }, [filteredData]);

  const chartData = useMemo(() => {
    const timeMap = new Map();
    filteredData.forEach(d => {
      const month = format(d.Fecha, 'MMM yy');
      timeMap.set(month, (timeMap.get(month) || 0) + d.Ventas);
    });
    const timeData = Array.from(timeMap.entries()).map(([date, sales]) => ({ date, sales }));

    const countryMap = new Map();
    filteredData.forEach(d => {
      countryMap.set(d.País, (countryMap.get(d.País) || 0) + d.Ventas);
    });
    const countryData = Array.from(countryMap.entries())
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales);

    const channelMap = new Map();
    filteredData.forEach(d => {
      channelMap.set(d.Canal, (channelMap.get(d.Canal) || 0) + d.Ventas);
    });
    const channelData = Array.from(channelMap.entries()).map(([name, sales]) => ({ name, sales }));

    return { timeData, countryData, channelData };
  }, [filteredData]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-2 bg-primary text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <span className="text-lg font-bold">Lector.</span>
        </div>
        
        <nav className="flex-1 py-6 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="Tablero" active />
          <SidebarItem icon={Box} label="Componentes" />
          <SidebarItem icon={Layers} label="Elementos UI" />
          <SidebarItem icon={PieChartIcon} label="Gráficos" />
          <SidebarItem icon={TableIcon} label="Tablas" />
          <SidebarItem icon={Settings} label="Configuración" />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-primary font-bold">
              JI
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">J. Apaza</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-slate-400">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-64"
            />
          </div>
          
          <div className="flex items-center gap-6 text-slate-400">
            <Bell size={20} className="cursor-pointer hover:text-primary transition-colors" />
            <Settings size={20} className="cursor-pointer hover:text-primary transition-colors" />
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 flex-1">
          <AnimatePresence mode="wait">
            {!data ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-20"
              >
                <FileUpload onDataLoaded={setData} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">ANÁLISIS DE VENTAS</h2>
                    <p className="text-sm text-slate-400 font-medium">Visualización de datos cargados</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setData(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-xl font-bold text-xs border border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <RefreshCcw size={16} />
                      Nuevo Archivo
                    </button>
                    <button className="btn-primary flex items-center gap-2 text-xs">
                      <Download size={16} />
                      Exportar PDF
                    </button>
                  </div>
                </div>

                {/* Filters */}
                {options && (
                  <Filters 
                    filters={filters} 
                    options={options} 
                    onFilterChange={setFilters} 
                  />
                )}

                {/* KPIs */}
                <KPIStats {...stats} />

                {/* Charts */}
                <Charts {...chartData} />

                {/* Data Table */}
                <div className="glass-card overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-800 text-white">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Estado de Pedidos</h3>
                    <div className="flex gap-2">
                      <button className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-all">
                        <Search size={14} />
                      </button>
                      <button className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-all">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Factura</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">País</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Venta</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredData.slice(0, 8).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-slate-400">#INV-{12384 + idx}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-800">{row.Cliente}</td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.País}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-800">{formatCurrency(row.Ventas)}</td>
                            <td className="px-6 py-4">
                              <span className={`status-badge ${
                                idx % 4 === 0 ? 'bg-pink-100 text-pink-600' :
                                idx % 4 === 1 ? 'bg-blue-100 text-blue-600' :
                                idx % 4 === 2 ? 'bg-amber-100 text-amber-600' :
                                'bg-emerald-100 text-emerald-600'
                              }`}>
                                {idx % 4 === 0 ? 'Procesando' : idx % 4 === 1 ? 'Abierto' : idx % 4 === 2 ? 'Enviado' : 'Pagado'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-white">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Mostrando 1 a 8 de {filteredData.length} entradas</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(p => (
                        <button key={p} className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-white shadow-md shadow-pink-200' : 'text-slate-400 hover:bg-slate-100'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="bg-white border-t border-slate-100 py-6 px-8 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            CREADO POR: JULIAN IGNACIO APAZA CCOA - CURSO DE EXCEL CON IA
          </p>
        </footer>
      </div>
    </div>
  );
}
