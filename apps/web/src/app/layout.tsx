import React from 'react';

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
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f4f5' }}>
        {children}
      </body>
    </html>
  );
}