import { useEffect } from 'react';
import { Badge } from './components/blocks/Badge';
import { Close } from './components/blocks/Close';
import { Faq } from './components/blocks/Faq';
import { Footer } from './components/blocks/Footer';
import { Hero } from './components/blocks/Hero';
import { HowYouEarn } from './components/blocks/HowYouEarn';
import { Join } from './components/blocks/Join';
import { Launch } from './components/blocks/Launch';
import { LongGame } from './components/blocks/LongGame';
import { Nav } from './components/blocks/Nav';
import { VideoTakes } from './components/blocks/VideoTakes';
import { WhatRiffiIs } from './components/blocks/WhatRiffiIs';
import { WhyHere } from './components/blocks/WhyHere';

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
        <VideoTakes />
        <WhatRiffiIs />
        <WhyHere />
        <HowYouEarn />
        <Badge />
        <LongGame />
        <Launch />
        <Join />
        <Faq />
        <Close />
      </main>
      <Footer />
    </>
  );
}
