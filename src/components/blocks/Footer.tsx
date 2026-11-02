import { content } from '../../content';
import { Wordmark } from '../primitives/Wordmark';

/** The footer row: the wordmark, and the legal / contact line once the founder supplies it (PRD 8). */
export function Footer() {
  const { footerLine } = content.close;
  return (
    <footer className="text-ink">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-4 px-5 pb-10 md:px-8 lg:px-10">
        <Wordmark small />
        {footerLine ? <p className="text-meta text-ink-soft">{footerLine}</p> : null}
      </div>
    </footer>
  );
}
