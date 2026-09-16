import { content } from '../../content';
import { Section } from '../primitives/Section';

/**
 * A take can be spoken as easily as typed. The cards are pictures of the format, each labelled a
 * sample: no clip is loaded and nothing plays on tap, so the block costs the page nothing.
 */
export function VideoTakes() {
  const block = content.videoTakes;
  return (
    <Section id="video-takes" tone="recess" belowFold>
      <h2 id="video-takes-heading" className="font-display text-display-l font-bold">
        {block.heading}
      </h2>
      <p className="mt-4 max-w-[34rem] text-body-l text-ink-soft">{block.lead}</p>
      <p className="mt-6">
        <span className="video-badge text-meta">{block.badge}</span>
      </p>
      <ul className="video-deck mt-6">
        {block.items.map((item, index) => (
          <li key={item.text} className="video-card" data-index={index}>
            <div className="video-frame">
              {'still' in item && item.still ? (
                // Decorative: the caption carries the meaning, and the note under the deck says
                // plainly that these are stock stills rather than Riffi creators.
                <img
                  src={item.still}
                  alt={block.stillAlt}
                  width={360}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="video-still"
                />
              ) : null}
              <span aria-hidden="true" className="video-pill video-tag">
                {block.chip}
              </span>
              <span aria-hidden="true" className="video-play">
                <svg width="18" height="20" viewBox="0 0 18 20" focusable="false" aria-hidden="true">
                  <path d="M0 0 L18 10 L0 20 Z" fill="currentColor" />
                </svg>
              </span>
              <span aria-hidden="true" className="video-pill video-length">
                {item.length}
              </span>
              {/* The take sits in the frame as burned-in captions, the way a spoken one carries it. */}
              <p className="video-caption font-display">
                <span className="sr-only">{block.chip}</span>
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[34rem] text-meta text-ink-soft">{block.stillNote}</p>
      <p className="mt-2 max-w-[34rem] text-meta text-ink-soft">{block.footer}</p>
    </Section>
  );
}
