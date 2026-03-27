import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { SalesData } from '../types';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onDataLoaded: (data: SalesData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (jsonData.length === 0) {
          throw new Error('El archivo está vacío o no tiene datos en la primera hoja.');
        }

        // Intelligent column mapping with aliases
        const columnAliases: { [key: string]: string[] } = {
          'Cliente': ['cliente', 'client', 'nombre cliente'],
          'País': ['pais', 'country', 'nacion', 'region'],
          'Canal': ['canal', 'channel', 'medio'],
          'Formato de pago': ['formato de pago', 'forma de pago', 'metodo de pago', 'pago', 'medio de pago', 'payment', 'payment method'],
          'Producto': ['producto', 'product', 'item', 'articulo'],
          'Vendedor': ['vendedor', 'seller', 'salesperson', 'comercial'],
          'Fecha': ['fecha', 'date', 'day'],
          'Ventas': ['ventas', 'sales', 'revenue', 'monto', 'importe', 'total'],
          'Cantidad': ['cantidad', 'quantity', 'qty', 'unidades', 'units']
        };

        const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

        const findKeyWithAliases = (row: any, target: string) => {
          const aliases = columnAliases[target] || [target];
          const rowKeys = Object.keys(row);
          
          for (const alias of aliases) {
            const aliasNorm = normalize(alias);
            const foundKey = rowKeys.find(key => normalize(key) === aliasNorm);
            if (foundKey) return foundKey;
          }
          return null;
        };

        const firstRow = jsonData[0];
        const detectedKeys = Object.keys(firstRow).map(k => `"${k}"`).join(', ');
        const missingColumns = Object.keys(columnAliases).filter(col => !findKeyWithAliases(firstRow, col));

        if (missingColumns.length > 0) {
          throw new Error(`No se encontró la columna "${missingColumns[0]}". En tu archivo detectamos: ${detectedKeys}. Por favor, renombra la columna en tu Excel.`);
        }

        const processedData: SalesData[] = jsonData.map((row) => {
          const getVal = (target: string) => row[findKeyWithAliases(row, target) || ''];
          
          let fechaVal = getVal('Fecha');
          let fecha: Date;

          if (fechaVal instanceof Date) {
            fecha = fechaVal;
          } else if (typeof fechaVal === 'number') {
            fecha = new Date((fechaVal - 25569) * 86400 * 1000);
          } else {
            fecha = new Date(fechaVal);
          }

          return {
            Cliente: String(getVal('Cliente') || ''),
            País: String(getVal('País') || ''),
            Canal: String(getVal('Canal') || ''),
            'Formato de pago': String(getVal('Formato de pago') || ''),
            Producto: String(getVal('Producto') || ''),
            Vendedor: String(getVal('Vendedor') || ''),
            Fecha: fecha,
            Ventas: Number(getVal('Ventas') || 0),
            Cantidad: Number(getVal('Cantidad') || 0),
          };
        }).filter(row => !isNaN(row.Fecha.getTime()));

        if (processedData.length === 0) {
          throw new Error('No se pudieron procesar las fechas. Asegúrate de que la columna Fecha tenga un formato válido.');
        }

        onDataLoaded(processedData);
      } catch (err: any) {
        setError(err.message || 'Error al procesar el archivo.');
        console.error(err);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-[2rem] p-16 transition-all duration-300 flex flex-col items-center justify-center gap-6 text-center cursor-pointer overflow-hidden",
          isDragging ? "border-primary bg-pink-50/50 scale-[1.02]" : "border-slate-200 hover:border-primary/30 bg-white"
        )}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx, .xls, .xlsm, .csv"
          onChange={handleFileChange}
        />
        
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-pink-200 rotate-3 hover:rotate-0 transition-transform duration-500">
          <Upload size={40} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Cargar Reporte de Ventas</h3>
          <p className="text-slate-400 font-medium max-w-xs mx-auto">Suelta tu archivo Excel aquí para iniciar el análisis inteligente</p>
        </div>
        
        <button className="btn-primary mt-4 px-8 py-3 rounded-2xl">
          Seleccionar Archivo
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-slate-100/50 border border-slate-200">
          <span className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Columnas</span>
          <span className="text-sm font-medium text-slate-600">Cliente, País, Canal...</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-100/50 border border-slate-200">
          <span className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Formato</span>
          <span className="text-sm font-medium text-slate-600">Excel / CSV</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-100/50 border border-slate-200">
          <span className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Proceso</span>
          <span className="text-sm font-medium text-slate-600">Automático</span>
        </div>
      </div>
    </div>
  );
};
