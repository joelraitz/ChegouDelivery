import React from 'react';
import './globals.css';

export const metadata = {
  title: 'ChegouDelivery | Entregas Rápidas',
  description: 'Peça lanches, ranchos e entregas expressas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}