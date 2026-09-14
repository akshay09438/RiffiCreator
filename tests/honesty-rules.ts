// Honesty patterns shared by content.test.ts and page.test.tsx (PRD 2.4, design 5).
// One copy, so the check on the copy and the check on the rendered page cannot drift apart.

/** A number (digits or a spelled-out number) directly before or after "points" / "pts". */
export const NUMBER_NEXT_TO_POINTS = new RegExp(
  [
    String.raw`\d[\d,.]*\s*[+x×*-]?\s*(?:points?|pts)\b`,
    String.raw`\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twenty|fifty|hundred|thousand|lakhs?)\s+(?:points?|pts)\b`,
    String.raw`\b(?:points?|pts)\s*[:=+x×*-]?\s*\d`,
  ].join('|'),
  'i',
);

/** A payout figure. */
export const MONEY = /₹|\bRs\.?\s?\d|\bINR\b/;

/** Words that frame a figure as an example of the shape, never a rate card. */
export const EXAMPLE_FRAMING = /\b(?:example|shape|illustration|illustrative|for instance)\b/i;

/** Countdown, deadline or pressure language. */
export const URGENCY =
  /\b(?:countdown|deadline|hurry|last chance|act now|don'?t miss|limited time|closing soon|ends? (?:today|tonight|soon)|expires?|only \d+|\d+\s*(?:seats?\s+)?(?:left|remaining)|(?:hours?|days?|minutes?|mins?)\s+(?:left|remaining|to go))\b/i;

/** A seat count such as "37/50", "37 of 50", "13 left" or "taken: 37". */
export const SEAT_COUNT =
  /\b\d+\s*(?:\/|of|out of)\s*\d+\b|\b\d+\s+(?:seats?\s+)?(?:taken|left|remaining|claimed|filled|gone)\b|\b(?:taken|claimed|filled)\s*:?\s*\d/i;

export const sentencesOf = (text: string): string[] => text.split(/(?<=[.!?])\s+/);
