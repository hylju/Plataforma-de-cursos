"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Não foi possível criar a conta.');
      }

      toast.success(result.message || 'Conta criada! Verifique seu e-mail para ativar.');
      router.push('/dashboard');
    } catch (error) {
      toast.error((error as Error).message || 'Falha ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-20">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold">Criar Conta</h1>
        <p className="mt-2 text-gray-600">Entre com email e senha para começar.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-gray-600">E-mail</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Senha</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none"
            />
          </label>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Já tem conta? <a href="/login" className="font-semibold text-brand hover:underline">Entrar</a>
        </div>
      </div>
    </div>
  );
}
