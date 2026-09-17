import { Contact } from "../components/sections/contact";
import { Hero } from "../components/sections/hero";
import { Lab } from "../components/sections/lab";
import { Timeline } from "../components/sections/timeline";
import { Work } from "../components/sections/work";
import { Writing } from "../components/sections/writing";
import { SiteNav } from "../components/site-nav";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteNav />
      <main id="conteudo">
        <Hero />
        <Work />
        <Lab />
        <Timeline />
        <Writing />
        <Contact />
      </main>
    </>
  );
}
