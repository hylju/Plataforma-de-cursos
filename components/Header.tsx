"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, Menu, UserCircle2 } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.assign('/login');
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur backdrop-saturate-150">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-brand">Academia</Link>
          <nav className="hidden items-center gap-3 md:flex text-sm font-medium text-gray-600">
            <Link href="#cursos" className="hover:text-brand">Cursos</Link>
            <Link href="#depoimentos" className="hover:text-brand">Depoimentos</Link>
            <Link href="#categorias" className="hover:text-brand">Categorias</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/courses" className="btn btn-secondary hidden md:inline-flex">Ver cursos</Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm text-gray-700">{user.email}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/register" className="btn btn-primary">Criar conta</Link>
            </div>
          )}

          <button className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="#cursos" onClick={() => setMobileOpen(false)} className="text-sm text-gray-600 hover:text-brand">Cursos</Link>
            <Link href="#depoimentos" onClick={() => setMobileOpen(false)} className="text-sm text-gray-600 hover:text-brand">Depoimentos</Link>
            <Link href="#categorias" onClick={() => setMobileOpen(false)} className="text-sm text-gray-600 hover:text-brand">Categorias</Link>
            <Link href="/login" className="btn btn-secondary">Login</Link>
            <Link href="/register" className="btn btn-primary">Criar conta</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
