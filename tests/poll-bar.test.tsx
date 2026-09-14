import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PollBar } from '../src/components/primitives/PollBar';

const agree = { label: 'agree', value: '71%', weight: 71 };
const disagree = { label: 'disagree', value: '29%', weight: 29 };

function pollElement(container: HTMLElement): HTMLElement {
  const element = container.querySelector<HTMLElement>('.poll');
  if (!element) throw new Error('the poll bar did not render');
  return element;
}

describe('PollBar', () => {
  it('draws the left side at its share of the total', () => {
    const { container } = render(
      <PollBar left={agree} right={disagree} variant="sample" showPercent />,
    );
    expect(pollElement(container).style.getPropertyValue('--fill')).toBe('71%');
  });

  it('carries both sides as text, so the meaning never depends on colour', () => {
    render(<PollBar left={agree} right={disagree} variant="sample" showPercent />);
    for (const text of ['71%', 'agree', '29%', 'disagree']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it('hides the drawn bar itself from assistive technology', () => {
    const { container } = render(
      <PollBar left={agree} right={disagree} variant="sample" showPercent />,
    );
    expect(container.querySelector('.poll-track')).toHaveAttribute('aria-hidden', 'true');
  });

  it('fills on load for the hero sample and on scroll for the other bars', () => {
    const { container, rerender } = render(
      <PollBar left={agree} right={disagree} variant="sample" showPercent />,
    );
    expect(pollElement(container)).toHaveAttribute('data-motion', 'load');
    rerender(<PollBar left={agree} right={disagree} variant="comparison" animateOnView />);
    expect(pollElement(container)).toHaveAttribute('data-motion', 'view');
  });

  it('staggers scroll reveals by 80ms per row', () => {
    const { container } = render(
      <PollBar left={agree} right={disagree} variant="comparison" animateOnView index={3} />,
    );
    expect(pollElement(container).style.getPropertyValue('--stagger')).toBe('240ms');
  });

  it('can draw the fill from the right, sized by the right side', () => {
    const { container } = render(
      <PollBar
        left={{ label: 'Instagram', value: 'Lakhs', weight: 12 }}
        right={{ label: 'Riffi', value: '49', weight: 88 }}
        variant="comparison"
        animateOnView
        fill="right"
      />,
    );
    expect(pollElement(container)).toHaveAttribute('data-fill', 'right');
    expect(pollElement(container).style.getPropertyValue('--fill')).toBe('88%');
  });

  it('shows each comparison side as its label and its value', () => {
    render(
      <PollBar
        left={{ label: 'Instagram', value: 'Lakhs', weight: 12 }}
        right={{ label: 'Riffi', value: '49', weight: 88 }}
        variant="comparison"
        animateOnView
      />,
    );
    for (const text of ['Instagram', 'Lakhs', 'Riffi', '49']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it('draws an empty meter with no text when there is no real number', () => {
    const { container } = render(
      <PollBar
        left={{ label: '', value: '', weight: 0 }}
        right={{ label: '', value: '', weight: 50 }}
        variant="meter"
        animateOnView
      />,
    );
    expect(pollElement(container).style.getPropertyValue('--fill')).toBe('0%');
    expect(container.textContent).toBe('');
  });
});
