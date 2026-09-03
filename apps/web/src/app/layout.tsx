import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'ChegouDelivery - Entregas Rápidas',
  description: 'Plataforma completa de delivery para clientes, restaurantes e entregadores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50/50 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
