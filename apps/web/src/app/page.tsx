'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Utensils, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Loader2, 
  X,
  ArrowRight
} from 'lucide-react';

interface CreatedOrder {
  id: string;
  totalAmount: number;
  deliveryAddress: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'SNACK' | 'GROCERY' | 'PARCEL'>('SNACK');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('35.00');
  const [loading, setLoading] = useState(false);

  // Estados do Modal de Checkout/Pagamento
  const [activeOrder, setActiveOrder] = useState<CreatedOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return alert('Por favor, informe o endereço de entrega.');

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3333/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          deliveryAddress: address,
          totalAmount: parseFloat(amount),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActiveOrder(data.order);
      } else {
        alert(data.error || 'Erro ao criar pedido.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!activeOrder) return;

    try {
      setIsProcessingPay(true);
      const res = await fetch(`http://localhost:3333/orders/${activeOrder.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod }),
      });

      if (res.ok) {
        setPaidSuccess(true);
        setTimeout(() => {
          setActiveOrder(null);
          setPaidSuccess(false);
          router.push('/orders');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao processar pagamento.');
    } finally {
      setIsProcessingPay(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <main className="mx-auto max-w-4xl px-6 pt-10">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            O que você deseja <span className="text-emerald-600">pedir hoje?</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">Escolha a categoria e informe o endereço para entregarmos rapidinho.</p>
        </div>

        {/* Formulário de Pedido */}
        <form onSubmit={handleCreateOrder} className="mt-8 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          {/* Categorias */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { id: 'SNACK', label: 'Lanches', icon: Utensils, desc: 'Restaurantes e Fast Food' },
              { id: 'GROCERY', label: 'Mercado', icon: ShoppingCart, desc: 'Compras do mês ou dia' },
              { id: 'PARCEL', label: 'Encomendas', icon: Package, desc: 'Envio de documentos/pacotes' },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedType === cat.id;

              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedType(cat.id as any)}
                  className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="mt-3 text-sm font-bold">{cat.label}</span>
                  <span className="text-[11px] text-slate-500">{cat.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Dados do Pedido */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700">Endereço de Entrega</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Av. Paulista, 1000 - Apto 42"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Valor Estimado (R$)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
            Avançar para Pagamento
          </button>
        </form>
      </main>

      {/* Modal de Checkout / Pagamento Simulado */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">Checkout - Pagamento</h2>
              {!isProcessingPay && !paidSuccess && (
                <button onClick={() => setActiveOrder(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {paidSuccess ? (
              <div className="my-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
                <h3 className="mt-3 text-lg font-black text-slate-900">Pagamento Confirmado!</h3>
                <p className="mt-1 text-xs text-slate-500">Seu pedido foi enviado ao restaurante.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">Total a pagar:</span>
                  <span className="text-lg font-black text-slate-900">R$ {activeOrder.totalAmount.toFixed(2)}</span>
                </div>

                {/* Métodos de Pagamento */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                      paymentMethod === 'PIX'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="h-4 w-4" />
                    PIX
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Cartão
                  </button>
                </div>

                {/* Área Pix ou Cartão */}
                {paymentMethod === 'PIX' ? (
                  <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 p-4 text-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                      <QrCode className="h-20 w-20 text-slate-700" />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">Escaneie o QR Code ou clique abaixo para simular a aprovação instantânea.</p>
                  </div>
                ) : (
                  <div className="space-y-2 rounded-xl border border-slate-200 p-3 text-xs">
                    <input type="text" placeholder="Número do Cartão" defaultValue="4532 •••• •••• 8892" className="w-full rounded-lg border border-slate-200 p-2 text-slate-700" readOnly />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="MM/AA" defaultValue="12/28" className="rounded-lg border border-slate-200 p-2 text-slate-700" readOnly />
                      <input type="text" placeholder="CVV" defaultValue="123" className="rounded-lg border border-slate-200 p-2 text-slate-700" readOnly />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPay}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                >
                  {isProcessingPay ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Confirmar e Pagar <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
