'use client';

import React, { useState } from 'react';

export default function OrderForm() {
  const [type, setType] = useState<'SNACK' | 'GROCERY' | 'PARCEL'>('SNACK');
  const [totalAmount, setTotalAmount] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:3333/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'usr_guest_demo', // ID temporário para teste
          type,
          totalAmount: parseFloat(totalAmount),
          deliveryAddress,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar o pedido');
      }

      setMessage({ text: 'Pedido enviado com sucesso!', type: 'success' });
      setTotalAmount('');
      setDeliveryAddress('');
      
      // Recarrega a página para atualizar a lista de pedidos
      window.location.reload();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erro ao enviar o pedido. Verifique se a API está online.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#111827' }}>➕ Novo Pedido</h2>

      {message && (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
            Tipo de Pedido:
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'SNACK' | 'GROCERY' | 'PARCEL')}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="SNACK">🍔 Lanche</option>
            <option value="GROCERY">🛒 Rancho</option>
            <option value="PARCEL">📦 Encomenda</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
            Valor Total (R$):
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ex: 45.50"
            required
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
            Endereço de Entrega:
          </label>
          <input
            type="text"
            placeholder="Ex: Rua das Flores, 123 - Centro"
            required
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#16a34a',
            color: '#fff',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Enviando...' : 'Cadastrar Pedido'}
        </button>
      </form>
    </div>
  );
}