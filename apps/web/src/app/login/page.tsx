'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Lock, UserCheck, ArrowRight, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://chegoudelivery-api.onrender.com';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Formulário
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // CORRIGIDO: Tipo alterado de 'CUSTOMER' para 'CLIENT'
  const [role, setRole] = useState<'CLIENT' | 'RESTAURANT' | 'DRIVER'>('CLIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const endpoint = isRegister ? `${API_URL}/register` : `${API_URL}/session`;

    const payload = isRegister
      ? { name, phone, role, email, password }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Formata mensagem de erro tratada ou do Zod
        const formattedError = typeof data.error === 'string' 
          ? data.error 
          : data.message || 'Erro de validação nos dados enviados.';
        throw new Error(formattedError);
      }

      if (data.token) {
        localStorage.setItem('@chegoudelivery:token', data.token);
      }

      if (isRegister) {
        alert('Conta criada com sucesso! Faça seu login.');
        setIsRegister(false);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setErrorMessage(err.message || 'Erro ao comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <UserCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Chegou<span className="text-emerald-600">Delivery</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isRegister ? 'Crie sua conta na plataforma' : 'Acesse sua conta para continuar'}
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="92995302165"
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tipo de Perfil
                </label>
                {/* CORRIGIDO: Valor do option ajustado para CLIENT */}
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="CLIENT">👤 Cliente</option>
                  <option value="RESTAURANT">🏪 Restaurante</option>
                  <option value="DRIVER">🛵 Entregador</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@gmail.com"
              className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs text-slate-900 outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRegister ? (
              <>
                <UserCheck className="h-4 w-4" /> Criar Conta
              </>
            ) : (
              <>
                Entrar <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage('');
            }}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-600"
          >
            {isRegister
              ? 'Já tem uma conta? Faça login'
              : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}