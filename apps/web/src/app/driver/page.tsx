'use client';

import React, { useEffect, useState } from 'react';
import { Bike, Navigation, CheckCircle, Clock, MapPin, Loader2, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  type: 'SNACK' | 'GROCERY' | 'PARCEL';
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryAddress: string;
}

export default function DriverDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3333/orders', { cache: 'no-store' });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:3333/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          driverId: 'drv_demo_123', // ID mock de entregador
        }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header do Entregador */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
              <Bike className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Painel do <span className="text-purple-600">Entregador</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">Corridas e Entregas em Tempo Real</p>
            </div>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
            Atualizar
          </button>
        </div>
      </header>

      {/* Lista de Corridas */}
      <main className="mx-auto max-w-4xl px-6 pt-8">
        <div className="space-y-4">
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Bike className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Nenhuma corrida no momento</h3>
              <p className="mt-1 text-xs text-slate-500">Aguardando novos pedidos de clientes.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {order.type === 'SNACK' && '🍔 Lanche'}
                      {order.type === 'GROCERY' && '🛒 Rancho'}
                      {order.type === 'PARCEL' && '📦 Encomenda'}
                    </span>
                    <span className="text-xs text-slate-400">#{order.id.slice(0, 8)}</span>
                  </div>

                  <span className="text-base font-extrabold text-emerald-600">
                    R$ {order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{order.deliveryAddress}</span>
                </div>

                {/* Ações baseadas no status */}
                <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Status: <strong className="text-slate-900">{order.status}</strong>
                  </span>

                  <div className="flex gap-2">
                    {(order.status === 'PENDING' || order.status === 'PREPARING') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'DELIVERING')}
                        disabled={updatingId === order.id}
                        className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Navigation className="h-3.5 w-3.5" />
                        )}
                        Aceitar e Iniciar Entrega
                      </button>
                    )}

                    {order.status === 'DELIVERING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                        disabled={updatingId === order.id}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        Marcar como Entregue
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle className="h-4 w-4" /> Finalizada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}