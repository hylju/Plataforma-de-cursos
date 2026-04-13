import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const email = body?.email?.toString()?.trim();
  const password = body?.password?.toString()?.trim();

  if (!email || !password) {
    return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
  }

  const isMasterAdmin = email === 'julia.moreschi.lima@escola.pr.gov.br';
  const authData: any = { email, password };

  if (isMasterAdmin) {
    authData.options = { data: { role: 'master_admin' } };
  }

  const { data, error } = await supabase.auth.signUp(authData);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user ?? null, message: 'Conta criada! Verifique seu e-mail para ativar.' });
}
