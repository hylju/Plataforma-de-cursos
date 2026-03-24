"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CheckCircle, Circle } from 'lucide-react';

type Course = { id: string; title: string; description: string; instructor: string; rating: number; };
type Module = { id: string; title: string; position: number; };
type Lesson = { id: string; module_id: string; title: string; content: string; video_url: string; position: number; };

type Progress = Record<string, { completed: boolean; percentage: number }>;

export default function CoursePage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: courseData } = await supabase.from('courses').select('*').eq('slug', slug).single();
      if (!courseData) {
        router.replace('/dashboard');
        return;
      }
      setCourse(courseData as Course);

      const { data: modulesData } = await supabase.from('modules').select('*').eq('course_id', courseData.id).order('position');
      setModules(modulesData as Module[]);

      if (modulesData?.length > 0) {
        const moduleIds = modulesData.map((m: Module) => m.id);
        const { data: lessonsData } = await supabase.from('lessons').select('*').in('module_id', moduleIds).order('position');
        setLessons(lessonsData as Lesson[]);
        setActiveLessonId(lessonsData?.[0]?.id ?? null);

        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        if (userId && lessonsData?.length > 0) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .in('lesson_id', lessonsData.map((l: Lesson) => l.id))
            .eq('user_id', userId);

          const map: Progress = {};
          progressData?.forEach((item: any) => {
            map[item.lesson_id] = { completed: item.completed, percentage: item.percentage };
          });
          setProgress(map);
        }
      }

      setLoading(false);
    }

    load();
  }, [slug, router]);

  const totalLessons = lessons.length;
  const completedLessons = Object.values(progress).filter((item) => item.completed).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const activeLesson = useMemo(() => lessons.find((lesson) => lesson.id === activeLessonId), [lessons, activeLessonId]);

  async function toggleCompletion(lessonId: string) {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    if (!userId) return;

    const isCompleted = progress[lessonId]?.completed;
    const { error } = await supabase.from('user_progress').upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: !isCompleted,
      percentage: !isCompleted ? 100 : 0,
    });

    if (error) {
      console.error(error);
      return;
    }

    setProgress((old) => ({ ...old, [lessonId]: { completed: !isCompleted, percentage: !isCompleted ? 100 : 0 }}));
  }

  if (loading) {
    return <div className="container mx-auto py-24 text-center">Carregando...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto grid gap-6 lg:grid-cols-[280px_1fr] pb-20 pt-8">
        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Módulos</h2>
          <div className="mt-3 space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="rounded-xl border border-gray-100 p-3">
                <h3 className="font-semibold">{module.title}</h3>
                <ul className="mt-2 space-y-1">
                  {lessons
                    .filter((lesson) => lesson.module_id === module.id)
                    .map((lesson) => (
                      <li key={lesson.id}>
                        <button
                          className={`w-full text-left text-sm ${activeLessonId === lesson.id ? 'font-bold text-brand' : 'text-gray-700'} flex items-center gap-2`}
                          onClick={() => setActiveLessonId(lesson.id)}
                        >
                          {progress[lesson.id]?.completed ? <CheckCircle className="h-4 w-4 text-progress" /> : <Circle className="h-4 w-4 text-gray-300" />}
                          {lesson.title}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{course?.title}</h1>
                <p className="text-sm text-gray-600">Instrutor: {course?.instructor}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-brand">Progresso: {progressPercent}%</p>
                <div className="mt-1 h-2 w-40 rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-progress" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {activeLesson ? (
            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">{activeLesson.title}</h2>
              <div className="aspect-video overflow-hidden rounded-xl border border-gray-200 bg-black">
                <iframe
                  src={activeLesson.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                  title="Video da aula"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <button className="btn btn-primary" onClick={() => toggleCompletion(activeLesson.id)}>
                {progress[activeLesson.id]?.completed ? 'Marcar como não concluída' : 'Marcar como concluída'}
              </button>
              <div className="prose max-w-none text-gray-700">
                <p>{activeLesson.content || 'Conteúdo complementar ainda não disponível para esta aula.'}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/lesson/${activeLesson.id}`} className="btn btn-secondary">Ir para página da aula</Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600">Selecione uma aula para começar</div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
