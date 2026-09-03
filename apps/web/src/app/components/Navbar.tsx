'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Truck, ShoppingBag, Utensils, Bike, LogIn, LogOut, User } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('@chegoudelivery:token');
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('@chegoudelivery:token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Início', icon: ShoppingBag },
    { href: '/restaurant', label: 'Restaurante', icon: Utensils },
    { href: '/driver', label: 'Entregador', icon: Bike },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-base font-black tracking-tight text-slate-900">
            Chegou<span className="text-emerald-600">Delivery</span>
          </span>
        </Link>

        {/* Links de Navegação */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Autenticação / Botões */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5" />
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
