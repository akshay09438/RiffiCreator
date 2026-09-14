import { renderToString } from 'react-dom/server';
import App from './App';
import { settings } from './content';

/** The site URL the pre-render step writes into the link-preview tags. */
export const siteUrl = settings.siteUrl;

/** Renders the whole page to static HTML (design option A). */
export function render(): string {
  return renderToString(<App />);
}
