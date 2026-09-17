import Link from "next/link";

export default function NotFound() {
  return (
    <main className="legal shell">
      <p className="label">Erro 404</p>
      <h1>Esta página não faz parte do mapa.</h1>
      <p>A rota que você procurou não existe ou mudou de endereço.</p>
      <Link className="btn btn--primary" href="/" style={{ justifySelf: "start" }}>
        Voltar ao portfólio
      </Link>
    </main>
  );
}
