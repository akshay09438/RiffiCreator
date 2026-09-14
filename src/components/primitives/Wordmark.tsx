import { content } from '../../content';

type WordmarkProps = {
  /** The footer row sets the wordmark smaller than the header does (PRD Block 8). */
  small?: boolean;
};

/** The Riffi wordmark: the display face at weight 800 until the brand kit supplies an SVG (PRD 8). */
export function Wordmark({ small = false }: WordmarkProps) {
  return (
    <span className={`font-display font-extrabold ${small ? 'text-body-l' : 'text-display-m'}`}>
      {content.nav.wordmark}
    </span>
  );
}
