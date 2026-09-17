import Link from "next/link";

export const metadata = { title: "Privacidade | Vinicios Engelage" };

export default function PrivacyPage() {
  return <main className="legal shell"><Link className="text-link" href="/">← Voltar ao portfólio</Link><p className="label">Informações legais</p><h1>Privacidade</h1><p>Este site não coleta dados pessoais automaticamente. Ao entrar em contato, suas informações são usadas apenas para responder à sua mensagem.</p></main>;
}
