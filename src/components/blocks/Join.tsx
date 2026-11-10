import { useEffect, useRef, useState, type FormEvent } from 'react';
import { content } from '../../content';
import { formAction, formFields } from '../../lib/cta';
import { submitDetails } from '../../lib/submit';
import { Section } from '../primitives/Section';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELD_ORDER = ['name', 'email', 'phone', 'handle', 'username'] as const;

/** The hidden bot trap's field name. Exported so tests use the same one. */
export const TRAP_FIELD = 'extra_notes_hp';

/** The username as they typed it, without a leading @ or stray spaces, and short enough to sit on one card. */
export function cleanUsername(raw: string): string {
  return raw.trim().replace(/^@+/, '').trim().slice(0, 40);
}

/**
 * Block 7: the details form. Without JavaScript it is a plain POST to the Google Form, so it still
 * works; with JavaScript the answers are sent quietly and the creator never leaves the page. Google
 * does not answer a cross-site post, so "sent" means the browser delivered it, not that Google
 * confirmed it - the founder checks the Form's responses after a first test.
 */
export function Join() {
  const block = content.join;
  const [status, setStatus] = useState<Status>('idle');
  const [username, setUsername] = useState('');
  const sent = useRef<HTMLDivElement>(null);

  // The form is much taller than the thank-you that replaces it, so on a phone the panel can end up
  // partly off screen. Bring it into view and move keyboard and screen-reader focus onto it, so the
  // coin's swish and the message are not missed.
  useEffect(() => {
    if (status !== 'sent') return;
    sent.current?.scrollIntoView?.({ block: 'start' });
    sent.current?.focus({ preventScroll: true });
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    // The browser already blocks an empty required field and an unticked permission box; this makes the
    // same rule hold in the code too, so nothing is ever sent without the creator's tick.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    // A person never sees the trap field; a bot fills it. Pretend it worked and send nothing. Its name
    // is deliberately not one a browser's autofill knows (such as "website"), so a real creator's
    // autofill can never fill it and quietly lose their details.
    if (data.get(TRAP_FIELD)) {
      setStatus('sent');
      return;
    }
    data.delete(TRAP_FIELD);
    // Read back to them in the thank-you; kept only in this browser tab's memory.
    setUsername(cleanUsername(String(data.get(formFields.username) ?? '')));
    setStatus('sending');
    try {
      await submitDetails(new URLSearchParams(data as never));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    // The whole green panel becomes the thank-you: the badge swishes up from the lower left, spinning
    // as it does in the app, and settles in the middle above the message (2 Nov 2026).
    return (
      <Section id="join" tone="recess" belowFold>
        <div
          ref={sent}
          role="status"
          tabIndex={-1}
          className="coin-stage flex scroll-mt-4 flex-col items-center text-center outline-none lg:scroll-mt-24"
        >
          <img
            src={content.badge.image}
            alt={content.join.badgeAlt}
            width={400}
            height={400}
            decoding="async"
            className="coin-swipe"
          />
          <h2 id="join-heading" className="mt-6 font-display text-display-l font-bold">
            {block.sentHeading}
          </h2>
          {username ? (
            <p className="feature-card mt-4 max-w-full break-words font-display text-body-l font-bold text-ink">
              {block.sentHolding(username)}
            </p>
          ) : null}
          <p className="mt-4 max-w-[30rem] text-body-l text-ink">{block.sentBody}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="join" tone="recess" belowFold>
      {/* Two columns from a laptop up, like the other blocks: the badge and heading on the left, the
          form on the right. On a phone everything stacks and the coin sits beside the heading. */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-6">
            {/* Decorative: the note below says the same thing in words. */}
            <img
              src={content.badge.image}
              alt={content.join.badgeAlt}
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
              className="badge-coin-small"
            />
            <div>
              <h2 id="join-heading" className="font-display text-display-l font-bold">
                {block.heading}
              </h2>
              <p className="mt-2 text-body-l text-ink">{block.lead}</p>
            </div>
          </div>
          <p className="mt-4 text-body font-semibold text-ink">{block.badgeNote}</p>
        </div>
        <div className="lg:col-span-7">
          <form
            action={formAction}
            method="post"
            onSubmit={onSubmit}
            className="grid gap-5 sm:grid-cols-2"
          >
            {FIELD_ORDER.map((key) => {
              const field = block.fields[key];
              return (
                <label
                  key={key}
                  className={`grid gap-2 text-body font-semibold text-ink ${key === 'username' ? 'sm:col-span-2' : ''}`}
                >
                  {field.label}
                  <input
                    className="field"
                    type={field.type}
                    name={formFields[key]}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder || undefined}
                    required
                    maxLength={120}
                  />
                </label>
              );
            })}
            {/* Permission to show their content on their profile. A required tick box, never pre-ticked. Its
                value is the permission sentence itself, so a ticked box posts that exact sentence into the
                Google Form's "Permission given" column: the Sheet then shows what each creator agreed to. An
                unticked box posts nothing (and cannot be sent). */}
            <label className="consent flex items-start gap-3 text-body text-ink sm:col-span-2">
              <input
                type="checkbox"
                name={formFields.consent}
                value={block.consent}
                required
                className="consent-box"
              />
              <span>{block.consent}</span>
            </label>
            {/* The trap field: off-screen, skipped by keyboards and screen readers. */}
            <div aria-hidden="true" className="trap">
              <input type="text" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" />
            </div>
            <p className="text-meta text-ink-soft sm:col-span-2">{block.privacy}</p>
            {status === 'error' ? (
              <p role="alert" className="text-body font-semibold text-ink sm:col-span-2">
                {block.error}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-ink text-paper cta-sticker inline-flex min-h-11 items-center justify-center rounded-pill px-8 py-3 text-body-l font-bold"
              >
                {status === 'sending' ? block.sending : block.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}
