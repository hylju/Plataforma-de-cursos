"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Login realizado com sucesso!');
    router.push('/dashboard');
  }

  return (
    <div className="container mx-auto py-20">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-gray-600">Entre com sua conta para continuar</p>

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
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none"
            />
          </label>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Não tem conta? <a href="/register" className="font-semibold text-brand hover:underline">Crie agora</a>
        </div>
      </div>
    </div>
  );
}
