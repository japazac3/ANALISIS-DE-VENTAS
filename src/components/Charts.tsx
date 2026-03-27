import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '../lib/utils';

interface ChartsProps {
  timeData: any[];
  countryData: any[];
  channelData: any[];
}

const COLORS = ['#e91e63', '#9c27b0', '#2196f3', '#ff9800', '#4caf50', '#00bcd4'];

export const Charts: React.FC<ChartsProps> = ({ timeData, countryData, channelData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tablero</h3>
            <p className="text-xs text-slate-400 font-medium">Resumen de ventas mensuales</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-primary border-b-2 border-primary pb-1">Mensual</span>
            <span>Anual</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e91e63" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e91e63" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSales2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9c27b0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                tickFormatter={(val) => `€${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [formatCurrency(value), 'Ventas']}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#e91e63" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#9c27b0" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorSales2)" 
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Tráfico</h3>
        <p className="text-xs text-slate-400 font-medium mb-8">Distribución por canal</p>
        <div className="h-[250px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="sales"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [formatCurrency(value), 'Ventas']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="block text-2xl font-bold text-slate-800">100%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-8">
          {channelData.slice(0, 3).map((entry, index) => (
            <div key={entry.name} className="text-center">
              <span className="block text-lg font-bold text-slate-800">
                {Math.round((entry.sales / channelData.reduce((a, b) => a + b.sales, 0)) * 100)}%
              </span>
              <div className="flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[50px]">{entry.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 lg:col-span-3">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Ventas por País</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8f9fd' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [formatCurrency(value), 'Ventas']}
              />
              <Bar dataKey="sales" fill="#e91e63" radius={[4, 4, 0, 0]} barSize={40}>
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
