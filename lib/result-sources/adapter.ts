import type { ResultQuery } from '@/lib/validation/result-query'
import type { ResultRecord } from '@/lib/result/types'
import type { SourceHealth } from './types'

import { getSource } from './registry'

/**
 * The board adapter contract and registry.
 *
 * THE REGISTRY IS EMPTY, AND THAT IS A POLICY STATE — NOT AN UNFINISHED ONE.
 *
 * Every board was assessed in the source risk register. Six sources across five
 * boards have confirmed CAPTCHAs, three sit behind VIEWSTATE/EVENTVALIDATION
 * that structurally rejects synthetic posts, three require JavaScript to
 * produce any result at all, and **not one publishes an API or any permission
 * to automate**. Exactly one board is even a technical candidate, and only with
 * written board permission, because a permissive robots.txt is not consent to
 * republish candidates' names, fathers' names and marks.
 *
 * So the honest product routes readers to official sources with verified
 * context. This contract exists so that the day a board grants access, an
 * adapter is added here and **no component, route or URL changes**.
 */

export type AdapterLookup = (
  query: ResultQuery,
  signal: AbortSignal,
) => Promise<ResultRecord | null>

export type BoardAdapter = {
  boardId: string
  /** Registry id of the source this adapter talks to. */
  sourceId: string
  /**
   * Hostnames this adapter is permitted to contact.
   *
   * SSRF control: upstream destinations come from configuration, never from
   * user input. A request is never built from anything a caller supplied.
   */
  allowedHosts: readonly string[]
  /**
   * Whether the adapter may run at all. An adapter whose source is behind a
   * CAPTCHA must return false, so the service falls back to official links.
   */
  canLookup: () => boolean
  /** Returns `null` for a genuine "no such record", and THROWS for anything else. */
  lookup: AdapterLookup
  /** Lightweight, conservative availability probe used by scheduled checks. */
  checkHealth?: (signal: AbortSignal) => Promise<SourceHealth>
}

/**
 * Registered adapters.
 *
 * Deliberately empty. Registering an adapter before a board's capabilities,
 * CAPTCHA behaviour and terms of access have been verified — and permission
 * obtained where personal data is involved — is a policy violation, not merely
 * a technical change. A validation test asserts this stays empty until that
 * changes deliberately.
 */
export const BOARD_ADAPTERS: readonly BoardAdapter[] = [] as const

/**
 * Per-adapter kill switch.
 *
 * Result-day incident recovery must never require deleting code or a page. An
 * adapter listed here stops making upstream requests immediately; the board
 * page keeps working and falls back to official links.
 */
const DISABLED_ADAPTERS = new Set<string>()

export function disableAdapter(boardId: string): void {
  DISABLED_ADAPTERS.add(boardId)
}

export function enableAdapter(boardId: string): void {
  DISABLED_ADAPTERS.delete(boardId)
}

export function isAdapterDisabled(boardId: string): boolean {
  return DISABLED_ADAPTERS.has(boardId)
}

/**
 * Synthetic adapters, registrable ONLY under the test runner.
 *
 * The production registry is empty and will stay empty until a board grants
 * access, but the machinery around it — the circuit breaker, the timeout, the
 * parser-failure classification, the provenance assertion — must be proven to
 * work before that day, not on it. These exist so those paths are exercised.
 *
 * Two independent guards keep them out of production: registration throws
 * outside the test runner, and resolution re-checks the runtime. Neither alone
 * would be enough, because a bundler that mangles `NODE_ENV` should not be able
 * to silently enable a fake result source.
 */
const TEST_ADAPTERS: BoardAdapter[] = []

function isTestRuntime(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV === 'test'
}

export function __registerTestAdapter(adapter: BoardAdapter): void {
  if (!isTestRuntime()) {
    throw new Error('Synthetic adapters may be registered only under the test runner.')
  }
  TEST_ADAPTERS.push(adapter)
}

export function __clearTestAdapters(): void {
  TEST_ADAPTERS.length = 0
}

/**
 * Resolve an adapter that is registered, enabled, permitted by its own
 * capability check, and whose source is still classified for integration.
 *
 * Four independent gates. A source that quietly acquires a CAPTCHA, or gets
 * reclassified after a re-check, stops being used without any other change.
 */
export function getAdapterForBoard(boardId: string): BoardAdapter | undefined {
  if (isAdapterDisabled(boardId)) return undefined

  const adapter = BOARD_ADAPTERS.find((candidate) => candidate.boardId === boardId)
  if (adapter) {
    if (!adapter.canLookup()) return undefined

    const source = getSource(adapter.sourceId)
    if (!source) return undefined
    if (source.integrationMode !== 'server-integration') return undefined
    if (source.hasCaptcha === 'verified-supported') return undefined

    return adapter
  }

  /*
   * Synthetic fallback. It skips ONLY the integration-mode gate — no real
   * source is classified `server-integration`, so requiring it would make the
   * machinery untestable. Every other gate still applies, including the
   * requirement that the source actually exist in the registry.
   */
  if (!isTestRuntime()) return undefined
  const synthetic = TEST_ADAPTERS.find((candidate) => candidate.boardId === boardId)
  if (!synthetic) return undefined
  if (!synthetic.canLookup()) return undefined
  if (!getSource(synthetic.sourceId)) return undefined
  return synthetic
}

/**
 * SSRF guard for adapter authors.
 *
 * An adapter must call this before any fetch. It refuses anything that is not
 * https, and anything whose host is not on that adapter's own allowlist —
 * including a redirect that leaves approved infrastructure.
 */
export function assertAllowedUrl(adapter: BoardAdapter, url: string): URL {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Adapter ${adapter.boardId}: malformed URL`)
  }
  if (parsed.protocol !== 'https:') {
    throw new Error(`Adapter ${adapter.boardId}: refused non-https destination`)
  }
  if (!adapter.allowedHosts.includes(parsed.hostname)) {
    throw new Error(`Adapter ${adapter.boardId}: host ${parsed.hostname} is not allowlisted`)
  }
  return parsed
}
