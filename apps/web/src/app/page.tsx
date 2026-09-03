import React from 'react';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidt: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#16a34a' }}>🚚 ChegouDelivery</h1>
        <p>Escolha o serviço desejado para realizar seu pedido:</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>🍔 Lanches</h3>
          <p>Restaurantes e fast-food da região.</p>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>🛒 Ranchos</h3>
          <p>Cestas básicas e feira completa.</p>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>📦 Encomendas</h3>
          <p>Envie documentos e pacotes rápidos.</p>
        </div>
      </div>
    </main>
  );
}