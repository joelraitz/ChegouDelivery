import React from 'react';
import OrderForm from './components/OrderForm';
import { Truck, Clock, CheckCircle2, Bike, AlertCircle, ShoppingBag, ShoppingCart, Package } from 'lucide-react';

interface Order {
  id: string;
  type: 'SNACK' | 'GROCERY' | 'PARCEL';
  status: string;
  totalAmount: number;
  deliveryAddress: string;
}

async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch('http://localhost:3333/orders', {
      cache: 'no-store',
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
    const config: Record<string, { label: string; bg: string; text: string; icon: any }> = {
      PENDING: { label: 'Pendente', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock },
      PREPARING: { label: 'Em Preparo', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: Clock },
      DELIVERING: { label: 'Em Trânsito', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', icon: Bike },
      DELIVERED: { label: 'Entregue', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle2 },
      CANCELLED: { label: 'Cancelado', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', icon: AlertCircle },
    };

    const item = config[status] || { label: status, bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', icon: Clock };
    const Icon = item.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${item.bg} ${item.text}`}>
        <Icon className="h-3.5 w-3.5" />
        {item.label}
      </span>
    );
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'SNACK':
        return <ShoppingBag className="h-5 w-5 text-amber-500" />;
      case 'GROCERY':
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case 'PARCEL':
        return <Package className="h-5 w-5 text-purple-500" />;
      default:
        return <Package className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Profissional */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                Chegou<span className="text-emerald-600">Delivery</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">Gestão Multisserviços</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API Online
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <OrderForm />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Pedidos Recentes</h2>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              Total: {orders.length}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Nenhum pedido encontrado</h3>
              <p className="mt-1 text-xs text-slate-500">Cadastre um novo pedido acima para começar.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
                      {getCategoryIcon(order.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {order.type === 'SNACK' && 'Lanche'}
                          {order.type === 'GROCERY' && 'Rancho'}
                          {order.type === 'PARCEL' && 'Encomenda'}
                        </span>
                        <span className="text-xs text-slate-400">#{order.id.slice(0, 8)}</span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-600">{order.deliveryAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                    <div className="text-right sm:text-right">
                      <span className="text-xs text-slate-400 block">Valor</span>
                      <span className="text-base font-extrabold text-slate-900">
                        R$ {order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
