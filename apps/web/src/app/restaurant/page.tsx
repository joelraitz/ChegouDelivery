'use client';

import React, { useEffect, useState } from 'react';
import { Utensils, Clock, CheckCircle2, PackageCheck, MapPin, Loader2, RefreshCw, ChefHat } from 'lucide-react';

interface Order {
  id: string;
  type: 'SNACK' | 'GROCERY' | 'PARCEL';
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
}

export default function RestaurantDashboard() {
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
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:3333/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header do Estabelecimento */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Painel do <span className="text-amber-500">Restaurante</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">Gestão e Preparo de Pedidos</p>
            </div>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            Atualizar
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-5xl px-6 pt-8">
        <div className="space-y-4">
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Utensils className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Nenhum pedido recebido</h3>
              <p className="mt-1 text-xs text-slate-500">Novos pedidos aparecerão aqui automaticamente.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
                      {order.type === 'SNACK' && '🍔 Lanches / Refeição'}
                      {order.type === 'GROCERY' && '🛒 Mercado'}
                      {order.type === 'PARCEL' && '📦 Encomenda'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">#{order.id.slice(0, 8)}</span>
                  </div>

                  <span className="text-lg font-black text-slate-900">
                    R$ {order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>

                {/* Ações e Atualização de Status */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Status atual:</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                        order.status === 'PENDING'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : order.status === 'PREPARING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : order.status === 'DELIVERING'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {order.status === 'PENDING' && 'Aguardando Aceite'}
                      {order.status === 'PREPARING' && 'Em Preparo'}
                      {order.status === 'DELIVERING' && 'Saiu para Entrega'}
                      {order.status === 'DELIVERED' && 'Entregue'}
                      {order.status === 'CANCELLED' && 'Cancelado'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => updateStatus(order.id, 'PREPARING')}
                        disabled={updatingId === order.id}
                        className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ChefHat className="h-3.5 w-3.5" />
                        )}
                        Aceitar e Iniciar Preparo
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                          <Clock className="h-3.5 w-3.5 animate-pulse" /> Em cozinha / Aguardando motoboy
                        </span>
                      </div>
                    )}

                    {order.status === 'DELIVERING' && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                        <PackageCheck className="h-3.5 w-3.5" /> Com o Entregador
                      </span>
                    )}

                    {order.status === 'DELIVERED' && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Pedido Concluído
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