import Link from 'next/link';

const featuredCourses = [
  {
    id: '1',
    slug: 'javascript-funcional',
    title: 'JavaScript Funcional para Desenvolvedores',
    instructor: 'Mariana Silva',
    rating: 4.9,
    progress: 32,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    slug: 'nextjs-fullstack',
    title: 'Next.js 14 Full Stack Avançado',
    instructor: 'Carlos Soares',
    rating: 4.8,
    progress: 58,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    slug: 'design-ux',
    title: 'UX/UI Design para Produtos Digitais',
    instructor: 'Fernanda Costa',
    rating: 4.7,
    progress: 19,
    thumbnail: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-50 to-violet-100 py-24">
        <div className="container mx-auto grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand">Plataforma de Cursos</span>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-6xl">Aprenda, pratique e evolua na sua carreira tech</h1>
            <p className="text-lg text-gray-600">Cursos completos com mentorias, módulos estruturados e certificado. Seu caminho está aqui.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary">Começar agora</Link>
              <Link href="/dashboard" className="btn btn-secondary">Ver meus cursos</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-violet-200 bg-white p-6 shadow-lg">
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" alt="Hero" className="h-72 w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      <section id="cursos" className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Cursos em destaque</h2>
          <Link href="/courses" className="text-brand hover:underline">Ver todos</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <Link key={course.id} href={`/course/${course.slug}`} className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img src={course.thumbnail} alt={course.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="p-4">
                <p className="text-sm font-semibold text-brand">{course.instructor}</p>
                <h3 className="mt-2 text-lg font-bold text-gray-900">{course.title}</h3>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span>★★★★☆ {course.rating}</span>
                  <span>{course.progress}% concluído</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-progress" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="categorias" className="container mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Desenvolvimento Web', 'UX/UI', 'Data Science', 'Marketing Digital'].map((item) => (
            <div key={item} className="rounded-xl border border-gray-200 bg-white p-5 text-center text-gray-700">{item}</div>
          ))}
        </div>
      </section>

      <section id="depoimentos" className="container mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Depoimentos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: 'Ana', quote: 'A plataforma transformou meu aprendizado e já recebi propostas de emprego.', photo: 'https://i.pravatar.cc/100?img=32' },
            { name: 'João', quote: 'O conteúdo é claro e a prática me manteve motivado até o final do curso.', photo: 'https://i.pravatar.cc/100?img=12' },
            { name: 'Lucas', quote: 'A comunidade e o suporte são o grande diferencial. Super recomendo.', photo: 'https://i.pravatar.cc/100?img=45' },
          ].map((item) => (
            <div key={item.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-gray-600">"{item.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <img src={item.photo} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                <span className="font-semibold">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
