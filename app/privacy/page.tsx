import type { Metadata } from "next";
import Link from "next/link";

const title = "Política de privacidade";
const description = "Como o site de Vinicios Engelage trata informações enviadas por contato.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="legal shell">
      <Link className="text-link" href="/">← Voltar ao portfólio</Link>
      <p className="label">Informações legais</p>
      <h1>Privacidade</h1>
      <p>
        Este site não coleta dados pessoais automaticamente. Ao entrar em contato, suas informações
        são usadas apenas para responder à sua mensagem.
      </p>
    </main>
  );
}
