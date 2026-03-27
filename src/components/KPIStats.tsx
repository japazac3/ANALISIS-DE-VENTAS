import React from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, CreditCard, Globe, Zap } from 'lucide-react';
import { formatCurrency, formatNumber } from '../lib/utils';

interface KPIStatsProps {
  totalSales: number;
  totalQuantity: number;
  uniqueCustomers: number;
  avgOrderValue: number;
}

export const KPIStats: React.FC<KPIStatsProps> = ({
  totalSales,
  totalQuantity,
  uniqueCustomers,
  avgOrderValue,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="kpi-card-vibrant bg-gradient-to-br from-pink-500 to-rose-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-pink-100 text-xs font-bold uppercase tracking-widest mb-1">Ventas Totales</p>
            <h3 className="text-3xl font-bold">{formatCurrency(totalSales)}</h3>
          </div>
          <div className="p-2 bg-white/20 rounded-lg">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded">
          <TrendingUp size={12} />
          <span>+12.5% vs mes anterior</span>
        </div>
      </div>

      <div className="kpi-card-vibrant bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-1">Unidades</p>
            <h3 className="text-3xl font-bold">{formatNumber(totalQuantity)}</h3>
          </div>
          <div className="p-2 bg-white/20 rounded-lg">
            <ShoppingCart size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded">
          <Zap size={12} />
          <span>Rendimiento óptimo</span>
        </div>
      </div>

      <div className="kpi-card-vibrant bg-gradient-to-br from-blue-500 to-cyan-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Clientes</p>
            <h3 className="text-3xl font-bold">{formatNumber(uniqueCustomers)}</h3>
          </div>
          <div className="p-2 bg-white/20 rounded-lg">
            <Users size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded">
          <Globe size={12} />
          <span>Alcance global</span>
        </div>
      </div>

      <div className="kpi-card-vibrant bg-gradient-to-br from-orange-400 to-amber-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-1">Ticket Promedio</p>
            <h3 className="text-3xl font-bold">{formatCurrency(avgOrderValue)}</h3>
          </div>
          <div className="p-2 bg-white/20 rounded-lg">
            <CreditCard size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded">
          <Package size={12} />
          <span>Valor por pedido</span>
        </div>
      </div>
    </div>
  );
};
