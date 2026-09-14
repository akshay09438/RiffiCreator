import { content } from '../../content';
import { ctaHref, whatsappFallbackHref } from '../../lib/cta';

const VARIANTS = {
  dark: { button: 'bg-ink text-paper', helper: 'text-ink-soft', fallback: 'text-ink' },
  light: { button: 'bg-paper text-ink', helper: 'text-on-ink-meta', fallback: 'text-paper' },
} as const;

type CtaButtonProps = { variant: keyof typeof VARIANTS };

/** The page's only conversion: open a DM with Riffi's Instagram account (PRD 5.4). */
export function CtaButton({ variant }: CtaButtonProps) {
  const styles = VARIANTS[variant];
  return (
    <div className="flex flex-col items-stretch lg:items-start">
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} inline-flex min-h-11 items-center justify-center rounded-pill px-8 py-3 text-body-l font-semibold`}
      >
        {content.cta.label}
      </a>
      <p className={`${styles.helper} mt-3 text-meta`}>{content.cta.helper}</p>
      {whatsappFallbackHref ? (
        <a
          href={whatsappFallbackHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.fallback} inline-flex min-h-11 items-center text-meta underline underline-offset-4`}
        >
          {content.cta.whatsappLabel}
        </a>
      ) : null}
    </div>
  );
}
