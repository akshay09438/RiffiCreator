import { content } from '../../content';
import { Chip } from '../primitives/Chip';
import { Wordmark } from '../primitives/Wordmark';

/** Wordmark left, the batch chip right; sticky from desktop up, with a hairline once scrolled (Block 1). */
export function Nav() {
  return (
    <header className="nav top-0 z-10 bg-paper lg:sticky">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 md:px-8 lg:px-10">
        <Wordmark />
        <Chip tone="blue">{content.nav.batch}</Chip>
      </div>
    </header>
  );
}
