import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

const root = document.getElementById('root');

if (root) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  // The built page arrives pre-rendered, so hydrate it; the dev server serves an empty shell, so render.
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
