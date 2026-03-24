"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type Course = {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  rating: number;
};

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;

      const { data: enrolled, error } = await supabase
        .from('enrollments')
        .select('course_id, course:course_id(id,title,slug,instructor,rating)')
        .eq('user_id', userId);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const mapped = enrolled?.map((item: any) => item.course).filter(Boolean);
      setCourses(mapped ?? []);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto pb-16 pt-8">
        <h1 className="text-3xl font-bold">Meu painel</h1>
        <p className="mt-2 text-gray-600">Cursos que você está matriculado</p>

        {loading ? (
          <div className="mt-8 text-center">Carregando...</div>
        ) : courses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-600">Você ainda não está inscrito em nenhum curso.</p>
            <Link href="/" className="btn btn-primary mt-4 inline-block">Ver cursos</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Link key={course.id} href={`/course/${course.slug}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="mt-1 text-sm text-gray-600">Instrutor: {course.instructor}</p>
                <p className="text-xs text-gray-500">Rating: {course.rating.toFixed(1)}</p>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-progress" style={{ width: '40%' }} />
                </div>
                <p className="mt-1 text-sm text-green-600 font-medium">Progresso estimado: 40%</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
