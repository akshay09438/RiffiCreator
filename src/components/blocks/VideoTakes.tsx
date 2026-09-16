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
            <div className="video-frame" aria-hidden="true">
              <span className="video-pill video-tag">{block.chip}</span>
              <span className="video-play">
                <svg width="18" height="20" viewBox="0 0 18 20" focusable="false" aria-hidden="true">
                  <path d="M0 0 L18 10 L0 20 Z" fill="currentColor" />
                </svg>
              </span>
              <span className="video-pill video-length">{item.length}</span>
            </div>
            <p className="video-text font-display">
              {/* The frame's own sample label is decorative, so repeat it for screen readers. */}
              <span className="sr-only">{block.chip}</span>
              {item.text}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[34rem] text-meta text-ink-soft">{block.footer}</p>
    </Section>
  );
}
