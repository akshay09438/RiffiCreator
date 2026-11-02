// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { settings } from '../src/content';
import { submitDetails } from '../src/lib/submit';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));

describe('submitDetails: the page\'s one network request (2 Nov 2026)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the answers to the Google Form\'s response address, in no-cors mode, and nowhere else', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);
    const answers = new URLSearchParams({ 'entry.1': 'a' });
    await submitDetails(answers);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(settings.form.responseUrl);
    expect(init).toEqual({ method: 'POST', mode: 'no-cors', body: answers });
  });

  it('rejects when the network fails, so the form can say so', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(submitDetails(new URLSearchParams())).rejects.toThrow('offline');
  });

  it('is the only file under src/ that uses fetch, XMLHttpRequest, WebSocket, EventSource or sendBeacon', () => {
    const users = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
      .filter((entry) => /\.(ts|tsx)$/.test(entry))
      .filter((entry) =>
        /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(|\bnew\s+(?:XMLHttpRequest|WebSocket|EventSource)\b|sendBeacon/.test(
          readFileSync(path.join(SRC, entry), 'utf8'),
        ),
      )
      .map((entry) => entry.replaceAll('\\', '/'));
    expect(users).toEqual(['lib/submit.ts']);
  });
});
