'use client';

import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  MapPin, 
  RefreshCw, 
  Loader2, 
  Package, 
  ShoppingBag, 
  ShoppingCart 
} from 'lucide-react';
import { ProtectedRoute } from '../../components/ProtectedRoute';

interface Order {
  id: string;
  type: 'SNACK' | 'GROCERY' | 'PARCEL';
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
}

const STEPS = [
  { status: 'PENDING', label: 'Pedido Recebido', icon: Clock },
  { status: 'PREPARING', label: 'Em Preparo', icon: ChefHat },
  { status: 'DELIVERING', label: 'Saiu para Entrega', icon: Bike },
  { status: 'DELIVERED', label: 'Entregue', icon: CheckCircle2 },
];

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
    const interval = setInterval(fetchOrders, 5000); // Polling automático a cada 5s
    return () => clearInterval(interval);
  }, []);

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PREPARING': return 1;
      case 'DELIVERING': return 2;
      case 'DELIVERED': return 3;
      default: return -1;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50 pb-12">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Meus <span className="text-emerald-600">Pedidos</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">Acompanhe suas entregas em tempo real</p>
            </div>

            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              Atualizar
            </button>
          </div>
        </header>

        {/* Lista de Pedidos */}
        <main className="mx-auto max-w-4xl px-6 pt-8">
          <div className="space-y-6">
            {loading && orders.length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Você ainda não possui pedidos</h3>
                <p className="mt-1 text-xs text-slate-500">Faça seu primeiro pedido na página inicial.</p>
              </div>
            ) : (
              orders.map((order) => {
                const currentStep = getStepIndex(order.status);

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Cabeçalho do Card */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                          {order.type === 'SNACK' && '🍔 Lanche'}
                          {order.type === 'GROCERY' && '🛒 Rancho'}
                          {order.type === 'PARCEL' && '📦 Encomenda'}
                        </span>
                        <span className="text-xs font-mono text-slate-400">#{order.id.slice(0, 8)}</span>
                      </div>

                      <span className="text-base font-extrabold text-slate-900">
                        R$ {order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Endereço */}
                    <div className="my-4 flex items-center gap-2 text-xs font-medium text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{order.deliveryAddress}</span>
                    </div>

                    {/* Linha do Tempo (Timeline Status) */}
                    <div className="mt-6 pt-2">
                      <div className="relative flex items-center justify-between">
                        {/* Linha de Progresso Backend */}
                        <div className="absolute left-0 top-1/2 -z-0 h-1 w-full -translate-y-1/2 bg-slate-100" />
                        <div
                          className="absolute left-0 top-1/2 -z-0 h-1 -translate-y-1/2 bg-emerald-500 transition-all duration-500"
                          style={{
                            width: `${currentStep >= 0 ? (currentStep / (STEPS.length - 1)) * 100 : 0}%`,
                          }}
                        />

                        {/* Etapas */}
                        {STEPS.map((step, idx) => {
                          const Icon = step.icon;
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step.status} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                                  isCompleted
                                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                    : 'border-slate-200 bg-white text-slate-400'
                                } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={`mt-2 text-center text-[10px] font-bold ${
                                  isCompleted ? 'text-slate-900' : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}