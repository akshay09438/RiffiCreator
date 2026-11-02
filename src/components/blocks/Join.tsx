import { useState, type FormEvent } from 'react';
import { content } from '../../content';
import { formAction, formFields } from '../../lib/cta';
import { submitDetails } from '../../lib/submit';
import { Section } from '../primitives/Section';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELD_ORDER = ['name', 'email', 'phone', 'handle', 'username'] as const;

/**
 * Block 7: the details form. Without JavaScript it is a plain POST to the Google Form, so it still
 * works; with JavaScript the answers are sent quietly and the creator never leaves the page. Google
 * does not answer a cross-site post, so "sent" means the browser delivered it, not that Google
 * confirmed it - the founder checks the Form's responses after a first test.
 */
export function Join() {
  const block = content.join;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    // A person never sees the trap field; a bot fills it. Pretend it worked and send nothing.
    if (data.get('website')) {
      setStatus('sent');
      return;
    }
    data.delete('website');
    setStatus('sending');
    try {
      await submitDetails(new URLSearchParams(data as never));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <Section id="join" tone="recess" belowFold>
      <div className="max-w-[34rem]">
        <div className="flex items-center gap-4">
          {/* The badge beside the form: decorative, because the note next to it says it in words. */}
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
        {status === 'sent' ? (
          <div role="status" className="feature-card mt-8">
            <p className="font-display text-body-l font-bold text-ink">{block.sentHeading}</p>
            <p className="mt-2 text-body text-ink-soft">{block.sentBody}</p>
          </div>
        ) : (
          <form
            action={formAction}
            method="post"
            onSubmit={onSubmit}
            className="mt-8 grid gap-5"
          >
            {FIELD_ORDER.map((key) => {
              const field = block.fields[key];
              return (
                <label key={key} className="grid gap-2 text-body font-semibold text-ink">
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
            {/* The trap field: off-screen, skipped by keyboards and screen readers. */}
            <div aria-hidden="true" className="trap">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <p className="text-meta text-ink-soft">{block.privacy}</p>
            {status === 'error' ? (
              <p role="alert" className="text-body font-semibold text-ink">
                {block.error}
              </p>
            ) : null}
            <div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-ink text-paper cta-sticker inline-flex min-h-11 items-center justify-center rounded-pill px-8 py-3 text-body-l font-bold"
              >
                {status === 'sending' ? block.sending : block.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}
