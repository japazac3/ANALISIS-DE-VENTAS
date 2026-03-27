export interface SalesData {
  Cliente: string;
  País: string;
  Canal: string;
  'Formato de pago': string;
  Producto: string;
  Vendedor: string;
  Fecha: Date;
  Ventas: number;
  Cantidad: number;
}

export interface DashboardFilters {
  dateRange: { start: string; end: string };
  countries: string[];
  channels: string[];
  sellers: string[];
  products: string[];
  paymentMethods: string[];
}
