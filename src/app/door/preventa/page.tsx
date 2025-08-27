'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchPreorders, setPreorderChecked, insertAttendance } from '@/lib/data';
import type { Preorder } from '@/types';
import { clsx } from 'clsx';
import { Search, User, Ticket, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Toast from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PreventaPage() {
  const [rows, setRows] = useState<Preorder[]>([]);
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    (async () => {
      try { 
        setRows(await fetchPreorders()); 
      } catch (error) {
        setToast({ message: 'Error al cargar preventas', type: 'error' });
      } finally { 
        setLoading(false); 
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const base = term ? rows.filter(r => r.fullName.toLowerCase().includes(term)) : rows.slice();
    // incompletas primero, completas al final; luego por nombre
    return base.sort((a, b) => {
      const remA = (a.quantity - (a.checkedInCount ?? 0)) > 0;
      const remB = (b.quantity - (b.checkedInCount ?? 0)) > 0;
      if (remA !== remB) return remA ? -1 : 1;
      return a.fullName.localeCompare(b.fullName);
    });
  }, [rows, q]);

  async function updateCheckIn(id: number, newVal: number) {
    const item = rows.find(r => r.id === id);
    if (!item) return;
    if (newVal < 0 || newVal > item.quantity) return;

    const prev = rows;
    const prevVal = item.checkedInCount ?? 0;
    setBusyId(id);
    // optimista
    setRows(rs => rs.map(r => r.id === id ? { ...r, checkedInCount: newVal } : r));

    try {
      await setPreorderChecked(id, newVal);
      const delta = newVal - prevVal;
      if (delta > 0) await insertAttendance(delta);
      
      setToast({ 
        message: `Entrada actualizada: ${item.fullName}`, 
        type: 'success' 
      });
    } catch (e) {
      setRows(prev);
      setToast({ 
        message: 'No se pudo actualizar. Reintentá.', 
        type: 'error' 
      });
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-neutral-400">Cargando preventas…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Entradas Preventa</h1>
          <p className="text-neutral-400 mt-1">Gestiona el control de acceso de preventas</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Ticket className="w-4 h-4" />
          <span>{rows.length} preventas totales</span>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          placeholder="Buscar por nombre…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Total Preventas</p>
              <p className="text-2xl font-bold text-white">{rows.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Ticket className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Pendientes</p>
              <p className="text-2xl font-bold text-orange-400">
                {rows.filter(r => (r.quantity - (r.checkedInCount ?? 0)) > 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Completadas</p>
              <p className="text-2xl font-bold text-green-400">
                {rows.filter(r => (r.quantity - (r.checkedInCount ?? 0)) === 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de preventas */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Cantidad Total
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Ingresaron
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Faltan
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Actualizar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filtered.map((p, index) => {
                const ingresados = p.checkedInCount ?? 0;
                const faltan = p.quantity - ingresados;
                const completa = faltan === 0;

                return (
                  <tr 
                    key={p.id} 
                    className={clsx(
                      'hover:bg-neutral-800/50 transition-colors duration-200',
                      completa && 'bg-green-500/5 border-l-4 border-l-green-500'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={clsx(
                          'w-2 h-2 rounded-full',
                          completa ? 'bg-green-400' : 'bg-orange-400'
                        )} />
                        <span className={clsx(
                          'font-medium',
                          completa ? 'text-green-400' : 'text-white'
                        )}>
                          {p.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300">
                        {p.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-medium">{ingresados}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        completa 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      )}>
                        {faltan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {busyId === p.id ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Actualizando…</span>
                        </div>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          max={p.quantity}
                          value={ingresados}
                          onChange={e => updateCheckIn(p.id, Number(e.target.value))}
                          className="w-20 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={5}>
                    <div className="text-center space-y-3">
                      <Ticket className="w-12 h-12 text-neutral-600 mx-auto" />
                      <p className="text-neutral-500 text-lg">No hay preventas</p>
                      <p className="text-neutral-600 text-sm">No se encontraron preventas con los filtros actuales</p>
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
