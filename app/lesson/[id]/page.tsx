"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type Lesson = {
  id: string;
  title: string;
  module_id: string;
  content: string;
  video_url: string;
  position: number;
};

export default function LessonPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [otherLessons, setOtherLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: lessonData } = await supabase.from('lessons').select('*').eq('id', id).single();
      if (!lessonData) {
        router.replace('/dashboard');
        return;
      }
      setLesson(lessonData as Lesson);

      const moduleId = lessonData.module_id;
      const { data: lessonsInModule } = await supabase.from('lessons').select('*').eq('module_id', moduleId).order('position');
      setOtherLessons(lessonsInModule as Lesson[]);

      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      if (userId) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', userId)
          .eq('lesson_id', id)
          .single();
        setProgress(progressData?.completed ?? false);
      }

      setLoading(false);
    }

    load();
  }, [id, router]);

  async function toggleCompletion() {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    if (!userId) return;

    const newStatus = !progress;
    await supabase.from('user_progress').upsert({
      user_id: userId,
      lesson_id: id,
      completed: newStatus,
      percentage: newStatus ? 100 : 0,
    });

    setProgress(newStatus);
  }

  if (loading) {
    return <div className="container mx-auto py-28 text-center">Carregando...</div>;
  }

  if (!lesson) {
    return <div className="container mx-auto py-28 text-center text-red-600">Aula não encontrada.</div>;
  }

  const currentIndex = otherLessons.findIndex((item) => item.id === lesson.id);
  const prev = currentIndex > 0 ? otherLessons[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < otherLessons.length - 1 ? otherLessons[currentIndex + 1] : null;

  return (
    <ProtectedRoute>
      <div className="container mx-auto pb-16 pt-8">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="aspect-video overflow-hidden rounded-xl border border-gray-200 bg-black">
            <iframe src={lesson.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} allowFullScreen className="h-full w-full" />
          </div>

          <button onClick={toggleCompletion} className="btn btn-primary mt-4">
            {progress ? 'Marcar como não concluída' : 'Marcar como concluída'}
          </button>

          <div className="mt-6 space-y-4 text-gray-700">
            <p>{lesson.content || 'Conteúdo complementar da aula ainda não disponível.'}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {prev && <Link href={`/lesson/${prev.id}`} className="btn btn-secondary">← Aula anterior</Link>}
            {next && <Link href={`/lesson/${next.id}`} className="btn btn-secondary">Próxima aula →</Link>}
            <Link href="/dashboard" className="btn btn-secondary">Voltar ao dashboard</Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
