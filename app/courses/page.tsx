import Link from 'next/link';

export default function CoursesPage() {
  const sample = [
    { id: '1', slug: 'javascript-funcional', title: 'JavaScript Funcional para Desenvolvedores', instructor: 'Mariana Silva' },
    { id: '2', slug: 'nextjs-fullstack', title: 'Next.js 14 Full Stack Avançado', instructor: 'Carlos Soares' },
    { id: '3', slug: 'design-ux', title: 'UX/UI Design para Produtos Digitais', instructor: 'Fernanda Costa' },
  ];

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold">Todos os cursos</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sample.map((course) => (
          <Link key={course.id} href={`/course/${course.slug}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="text-sm text-gray-600">Instrutor: {course.instructor}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
