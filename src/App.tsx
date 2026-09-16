import { useEffect } from 'react';
import { Close } from './components/blocks/Close';
import { Faq } from './components/blocks/Faq';
import { Footer } from './components/blocks/Footer';
import { Hero } from './components/blocks/Hero';
import { HowYouEarn } from './components/blocks/HowYouEarn';
import { LongGame } from './components/blocks/LongGame';
import { Nav } from './components/blocks/Nav';
import { Seats } from './components/blocks/Seats';
import { VideoTakes } from './components/blocks/VideoTakes';
import { WhatRiffiIs } from './components/blocks/WhatRiffiIs';
import { WhyHere } from './components/blocks/WhyHere';
import { settings } from './content';

/** The page: the eight blocks in the order a creator's objections come up (PRD 2.2) - nothing else. */
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
        <LongGame />
        <Seats seats={settings.seats} />
        <Faq />
        <Close />
      </main>
      <Footer />
    </>
  );
}
