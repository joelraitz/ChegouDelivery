'use client';

import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart, Package, PlusCircle, Loader2 } from 'lucide-react';

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
          userId: 'usr_guest_demo',
          type,
          totalAmount: parseFloat(totalAmount),
          deliveryAddress,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar o pedido');
      }

      setMessage({ text: 'Pedido cadastrado com sucesso!', type: 'success' });
      setTotalAmount('');
      setDeliveryAddress('');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erro ao enviar o pedido. Verifique a conexão.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <PlusCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Novo Pedido</h2>
          <p className="text-xs text-slate-500">Selecione o serviço e informe os detalhes da entrega</p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm font-medium transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Seleção Visual de Categoria */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Categoria do Serviço
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'SNACK', label: 'Lanche', icon: ShoppingBag },
              { id: 'GROCERY', label: 'Rancho', icon: ShoppingCart },
              { id: 'PARCEL', label: 'Encomenda', icon: Package },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = type === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as any)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-700 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Valor Total (R$)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Endereço de Entrega
            </label>
            <input
              type="text"
              placeholder="Rua, número e bairro"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            'Confirmar Pedido'
          )}
        </button>
      </form>
    </div>
  );
}
