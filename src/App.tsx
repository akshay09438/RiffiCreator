import { useEffect } from 'react';
import { Badge } from './components/blocks/Badge';
import { Close } from './components/blocks/Close';
import { Faq } from './components/blocks/Faq';
import { Footer } from './components/blocks/Footer';
import { Hero } from './components/blocks/Hero';
import { Join } from './components/blocks/Join';
import { Launch } from './components/blocks/Launch';
import { Nav } from './components/blocks/Nav';

/** The page: the blocks in the order a creator's objections come up (PRD 2.2) - nothing else. */
export default function App() {
  useEffect(() => {
    // Hydration is done, so scroll reveals may wait for the reader. After 6 seconds the CSS failsafe
    // has already filled the bars, so leave it in charge rather than empty them again.
    if (performance.now() < 6000) document.documentElement.classList.add('app-ready');
  }, []);

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Launch />
        <Badge />
        <Join />
        <Faq />
        <Close />
      </main>
      <Footer />
    </>
  );
}
