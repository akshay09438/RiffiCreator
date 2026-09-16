import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chip } from '../src/components/primitives/Chip';
import { CtaButton } from '../src/components/primitives/CtaButton';
import { Section } from '../src/components/primitives/Section';
import { TakeCard } from '../src/components/primitives/TakeCard';
import { Wordmark } from '../src/components/primitives/Wordmark';
import { content, settings } from '../src/content';
import { ctaHref } from '../src/lib/cta';

describe('Section', () => {
  it('is a region labelled by the heading inside it', () => {
    render(
      <Section id="demo" tone="recess">
        <h2 id="demo-heading">Demo heading</h2>
      </Section>,
    );
    expect(screen.getByRole('region', { name: 'Demo heading' })).toHaveAttribute('id', 'demo');
  });
});

describe('Chip', () => {
  it.each(['blue', 'butter', 'coral', 'neutral'] as const)(
    'renders a %s chip as sentence-case text',
    (tone) => {
      render(<Chip tone={tone}>sample take</Chip>);
      const chip = screen.getByText('sample take');
      expect(chip).toHaveAttribute('data-tone', tone);
      expect(chip.className).not.toMatch(/uppercase/);
    },
  );
});

describe('CtaButton', () => {
  it.each(['dark', 'light'] as const)(
    'the %s button opens the application form in a new tab and names the handle that replies',
    (variant) => {
      render(<CtaButton variant={variant} />);
      const link = screen.getByRole('link', { name: content.cta.label });
      // Pinned to settings, not to ctaHref: comparing the link with the constant the component
      // used to build it would pass whatever the button pointed at (17 Sep 2026).
      expect(ctaHref).toBe(settings.applyFormUrl);
      expect(link).toHaveAttribute('href', settings.applyFormUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.getByText(content.cta.helper)).toBeInTheDocument();
    },
  );

  it('shows no WhatsApp link while the fallback is switched off', () => {
    render(<CtaButton variant="dark" />);
    expect(screen.queryByRole('link', { name: content.cta.whatsappLabel })).toBeNull();
  });
});

describe('TakeCard', () => {
  it('is an article that shows its label chip and the take', () => {
    render(<TakeCard chip="sample take" text="Being early beats being good." />);
    const card = screen.getByRole('article');
    expect(within(card).getByText('sample take')).toBeInTheDocument();
    expect(within(card).getByText('Being early beats being good.')).toBeInTheDocument();
  });

  it('draws its edge and shadow from take-card on every card, and marks only the featured one with the desktop tilt', () => {
    const { rerender } = render(<TakeCard chip="sample take" text="A take." />);
    const plainClasses = screen.getByRole('article').className;
    expect(plainClasses).toContain('take-card');
    expect(plainClasses).not.toContain('lg:-rotate-2');

    rerender(<TakeCard chip="sample take" text="A take." featured />);
    const featuredClasses = screen.getByRole('article').className;
    expect(featuredClasses).toContain('take-card');
    expect(featuredClasses).toContain('lg:-rotate-2');
  });
});

describe('Wordmark', () => {
  it('shows the Riffi wordmark', () => {
    render(<Wordmark />);
    expect(screen.getByText(content.nav.wordmark)).toBeInTheDocument();
  });

  it('has a smaller size for the footer row', () => {
    const { rerender } = render(<Wordmark />);
    expect(screen.getByText(content.nav.wordmark).className).toContain('text-display-m');
    rerender(<Wordmark small />);
    expect(screen.getByText(content.nav.wordmark).className).toContain('text-body-l');
  });
});
