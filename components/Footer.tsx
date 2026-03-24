import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Academia LMS. Todos os direitos reservados.</p>
        <div className="mt-2 space-x-4">
          <Link href="#" className="hover:text-brand">Termos</Link>
          <Link href="#" className="hover:text-brand">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
