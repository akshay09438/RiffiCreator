import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Hydration is done, so scroll reveals may wait for the reader. After 6 seconds the CSS failsafe
    // has already filled the bars, so leave it in charge rather than empty them again.
    if (performance.now() < 6000) document.documentElement.classList.add('app-ready');
  }, []);

  return (
    <>
      <header />
      <main id="main" />
      <footer />
    </>
  );
}
