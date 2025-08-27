import './globals.css';
import { DoorOpen, TicketIcon, CreditCardIcon } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
        {/* Header fijo */}
        <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo y título */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <DoorOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                    Panel de Puerta
                  </h1>
                  <p className="text-xs text-neutral-500">Control de Eventos</p>
                </div>
              </div>

              {/* Navegación */}
              <nav className="flex items-center space-x-1">
                <a 
                  href="/door/preventa"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200 group"
                >
                  <TicketIcon className="w-4 h-4 group-hover:text-indigo-400 transition-colors duration-200" />
                  <span className="font-medium">Preventa</span>
                </a>
                <a 
                  href="/door/venta"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200 group"
                >
                  <CreditCardIcon className="w-4 h-4 group-hover:text-indigo-400 transition-colors duration-200" />
                  <span className="font-medium">Venta</span>
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Footer sutil */}
        <footer className="mt-auto py-6 border-t border-neutral-800 bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-neutral-500">
              <p>Panel de Control de Puerta • Eventos</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
