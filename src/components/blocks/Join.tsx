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

  if (status === 'sent') {
    // The whole green panel becomes the thank-you: the badge swishes up from the lower left, spinning
    // as it does in the app, and settles in the middle above the message (2 Nov 2026).
    return (
      <Section id="join" tone="recess" belowFold>
        <div role="status" className="coin-stage flex flex-col items-center text-center">
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
          <p className="mt-3 max-w-[30rem] text-body-l text-ink">{block.sentBody}</p>
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
            {/* The trap field: off-screen, skipped by keyboards and screen readers. */}
            <div aria-hidden="true" className="trap">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
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
