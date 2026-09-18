import type { Metadata } from "next";
import Link from "next/link";

const title = "Termos de uso";
const description = "Termos de uso do portfólio e conteúdo publicado por Vinicios Engelage.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="legal shell">
      <Link className="text-link" href="/">← Voltar ao portfólio</Link>
      <p className="label">Informações legais</p>
      <h1>Termos</h1>
      <p>
        O conteúdo deste portfólio apresenta experiências, projetos e opiniões profissionais de
        Vinicios Engelage. A reprodução exige autorização prévia.
      </p>
    </main>
  );
}
