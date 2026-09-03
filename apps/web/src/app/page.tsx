import React from 'react';

interface Order {
  id: string;
  type: 'SNACK' | 'GROCERY' | 'PARCEL';
  status: string;
  totalAmount: number;
  deliveryAddress: string;
}

// Função de busca de dados na API
async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch('http://localhost:3333/orders', {
      cache: 'no-store', // Garante dados sempre atualizados
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar pedidos');
    }

    const data = await res.json();
    return data.orders || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const orders = await getOrders();

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: '⏳ Pendente',
      PREPARING: '👨‍🍳 Em Preparo',
      DELIVERING: '🛵 Em Trânsito',
      DELIVERED: '✅ Entregue',
      CANCELLED: '❌ Cancelado',
    };
    return map[status] || status;
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#16a34a' }}>🚚 ChegouDelivery</h1>
        <p>Painel de Acompanhamento de Pedidos em Tempo Real</p>
      </header>

      <section>
        <h2 style={{ marginBottom: '1rem' }}>📦 Pedidos Recentes</h2>
        
        {orders.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhum pedido encontrado ou API offline.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: '#fff',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {order.type === 'SNACK' && '🍔 Lanche'}
                    {order.type === 'GROCERY' && '🛒 Rancho'}
                    {order.type === 'PARCEL' && '📦 Encomenda'}
                  </strong>
                  <p style={{ margin: '0.5rem 0 0', color: '#555' }}>
                    Endereço: {order.deliveryAddress}
                  </p>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>
                    ID: {order.id}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#16a34a' }}>
                    R$ {order.totalAmount.toFixed(2)}
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      background: '#f3f4f6',
                    }}
                  >
                    {getStatusBadge(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
