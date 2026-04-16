import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json(
      { error: 'Service role key não configurada' },
      { status: 500 }
    );
  }

  const adminAuth = createClient(supabaseUrl, serviceRoleKey);
  const email = 'julia.moreschi.lima@escola.pr.gov.br';
  const password = '3pmaluf';

  try {
    // Tenta atualizar a senha do usuário existente
    const { data: users } = await adminAuth.auth.admin.listUsers({ perPage: 1000 });
    const user = users?.users?.find((u: any) => u.email === email);

    if (!user) {
      // Cria novo usuário
      const { user: newUser, error } = await adminAuth.auth.admin.createUser({
        email,
        password,
        user_metadata: { role: 'master_admin' },
        email_confirm: true,
      });

      if (error) {
        return NextResponse.json(
          { error: 'Erro ao criar: ' + error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Usuário admin criado com sucesso!',
        userId: newUser?.id,
      });
    }

    // Atualiza usuário existente
    const { data: updatedUser, error: updateError } = await adminAuth.auth.admin.updateUserById(
      user.id,
      {
        password,
        user_metadata: { role: 'master_admin' },
        email_confirm: true,
      }
    );

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar: ' + updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário admin atualizado com sucesso! Agora você pode fazer login.',
      userId: updatedUser?.id,
      email_verified: updatedUser?.email_confirmed_at ? true : false,
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}


