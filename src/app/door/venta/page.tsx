'use client';
import { useEffect, useState } from 'react';
import { createDoorSale, fetchDoorSales } from '@/lib/data';
import type { DoorSale } from '@/types';
import { CreditCard, DollarSign, User, Package, Calendar, Plus } from 'lucide-react';
import Toast from '@/components/Toast';

export default function VentaPage() {
  const [rows, setRows] = useState<DoorSale[]>([]);
  const [form, setForm] = useState({ fullName: '', quantity: 1, paymentMethod: 'Efectivo' });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Precio fijo por entrada
  const PRECIO_UNITARIO = 6000;

  useEffect(() => {
    (async () => {
      try {
        setRows(await fetchDoorSales());
      } catch {
        setToast({ message: 'Error al cargar ventas', type: 'error' });
      }
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const finalPrice = Number(form.quantity) * PRECIO_UNITARIO;
      const ins = await createDoorSale({
        fullName: form.fullName.trim() || '-', // NOT NULL
        quantity: Number(form.quantity),
        finalPrice,
        paymentMethod: form.paymentMethod
      });
      setRows(r => [ins, ...r]);
      setForm({ fullName: '', quantity: 1, paymentMethod: 'MercadoPago' });
      setCashAmount('');
      setShowCashCalculator(false);
      
      setToast({ 
        message: `Venta registrada: ${ins.fullName} - $${ins.finalPrice?.toLocaleString()}`, 
        type: 'success' 
      });
    } catch {
      setToast({ message: 'No se pudo guardar la venta.', type: 'error' });
    } finally {
      setBusy(false);
    }
  }

  const [cashAmount, setCashAmount] = useState('');
  const [showCashCalculator, setShowCashCalculator] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Venta en Puerta</h1>
          <p className="text-neutral-400 mt-1">Registra nuevas ventas de entradas</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <CreditCard className="w-4 h-4" />
          <span>{rows.length} ventas registradas</span>
        </div>
      </div>

      

      {/* Formulario de venta */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">Nueva Venta</h2>
        </div>
        
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Nombre completo"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="number"
              min={1}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
              required
            />
          </div>
          
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <select
              className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none"
              value={form.paymentMethod}
              onChange={e => {
                setForm({ ...form, paymentMethod: e.target.value });
                setShowCashCalculator(e.target.value === 'Billete');
                setCashAmount('');
              }}
            >
              <option>MercadoPago</option>
              <option>Billete</option>
            </select>
          </div>

          {/* Calculadora de efectivo */}
          {showCashCalculator && (
            <div className="col-span-full p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Calculadora de Efectivo</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-2">Total a pagar</label>
                  <div className="text-2xl font-bold text-green-400">
                    ${(form.quantity * PRECIO_UNITARIO).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-neutral-400 mb-2">Dinero recibido</label>
                  <input
                    type="number"
                    min={form.quantity * PRECIO_UNITARIO}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    value={cashAmount}
                    onChange={e => setCashAmount(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-neutral-400 mb-2">Vuelto a dar</label>
                  <div className="text-2xl font-bold text-blue-400">
                    ${cashAmount ? (Number(cashAmount) - (form.quantity * PRECIO_UNITARIO)).toLocaleString() : '0'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón de registro */}
          <div className="mt-6">
            <button 
              type="submit"
              disabled={busy} 
              className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl"
            >
              {busy ? 'Guardando...' : 'Registrar Venta'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-white">Historial de Ventas</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Comprador
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2 justify-center">
                    <Package className="w-4 h-4" />
                    Cantidad
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2 justify-center">
                    <CreditCard className="w-4 h-4" />
                    Método
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2 justify-center">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2 justify-center">
                    <DollarSign className="w-4 h-4" />
                    Monto
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {rows.map((r, index) => (
                <tr 
                  key={r.id} 
                  className="hover:bg-neutral-800/50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{r.fullName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
                      {r.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-neutral-300">{r.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-neutral-400 text-sm">{r.date}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-green-400">${r.finalPrice?.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={5}>
                    <div className="text-center space-y-3">
                      <CreditCard className="w-12 h-12 text-neutral-600 mx-auto" />
                      <p className="text-neutral-500 text-lg">Sin ventas aún</p>
                      <p className="text-neutral-600 text-sm">Registra tu primera venta usando el formulario de arriba</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
