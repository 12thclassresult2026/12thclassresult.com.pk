import type { VerifiedFact } from '@/lib/result/verified-fact'

/**
 * The Punjab-wide HSSC Part-II result announcement.
 *
 * ONE CONSTANT, NOT A LITERAL IN A COMPONENT. This exists because the site
 * spent a week telling students the result was on 22 October 2026. That string
 * was typed into `site-header.tsx` and `result-update-ticker.tsx` during two
 * design commits, matched nothing in any registry, cited nothing, and was
 * labelled "Official PBCC Date" — so a reader had every reason to believe it.
 * A date in two components is a date nobody owns; a date here is one edit and
 * one place to check.
 *
 * WHAT THE STATUS MEANS, AND WHY IT IS NOT `confirmed`.
 *
 * Two independent outlets report that the Punjab Boards Committee of Chairmen
 * circulated a common result calendar putting all nine Punjab boards on
 * Wednesday 23 September 2026 at 10:00 AM. Checked against BISE Lahore's own
 * site on 2026-09-22, the day before: no HSSC Part-II 2026 result notification
 * was published there.
 *
 * So this is press reporting of a committee calendar, not a board notification
 * read on a board domain — which is exactly what `tentative` is for, and why
 * `isSourced()` deliberately returns false for it. The registry's standing note
 * applies: the same result had 13, 18 and 23 September circulating, and the
 * only reason this one is carried is that it now has named reporting behind it
 * and the boards' own calendars agree on the session.
 *
 * WHEN THE BOARDS PUBLISH THEIR OWN NOTIFICATION, move this to `confirmed` and
 * point `sourceUrl` at that notification. Until then the UI must not call it
 * official.
 */
export const PUNJAB_HSSC_PART2_ANNOUNCEMENT: VerifiedFact<string> = {
  value: '2026-09-23',
  status: 'tentative',
  sourceId: 'pbcc-common-calendar-2026',
  sourceUrl:
    'https://propakistani.pk/2026/09/04/all-punjab-boards-confirm-class-12-result-date-and-time/',
  sourcePublishedAt: '2026-09-04',
  checkedAt: '2026-09-22',
  validFor: 'HSSC Part-II 2026, Punjab boards',
}

/** Announcement time as the calendar states it. Kept beside the date it belongs to. */
export const PUNJAB_HSSC_PART2_ANNOUNCEMENT_TIME = '10:00 AM'

/** The nine boards the common calendar covers, for copy that names a scope. */
export const PUNJAB_COMMON_CALENDAR_BOARD_COUNT = 9

/** `2026-09-23` → `23 September 2026`. */
export function formatAnnouncementDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
