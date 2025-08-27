import Link from 'next/link';
import { DoorOpen, TicketIcon, CreditCardIcon, TrendingUpIcon, UsersIcon, CalendarIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
            <DoorOpen className="w-10 h-10 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Panel de Control de Puerta
          </h1>
          <p className="text-xl text-neutral-400 mt-4 max-w-2xl mx-auto">
            Gestiona el control de acceso, preventas y ventas en puerta de tus eventos de manera eficiente y profesional
          </p>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Acciones Rápidas</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/door/preventa"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <TicketIcon className="w-5 h-5" />
            Gestionar Preventas
          </Link>
          <Link 
            href="/door/venta"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <CreditCardIcon className="w-5 h-5" />
            Registrar Venta
          </Link>
        </div>
      </div>
    </div>
  );
}
