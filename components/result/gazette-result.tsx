'use client'

import { useEffect, useRef, useState } from 'react'

import type { LookupOutcome } from '@/lib/gazettes/lookup'

/* ─── Zero-Dependency Confetti Particle Effect ─── */
function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const colors = [
      '#10B981',
      '#0069D9',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
      '#FBBF24',
    ]
    const particles: Array<{
      x: number
      y: number
      w: number
      h: number
      color: string
      vx: number
      vy: number
      rotation: number
      vRot: number
      opacity: number
    }> = []

    for (let i = 0; i < 85; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * width * 0.7,
        y: Math.random() * height * 0.35 - 40,
        w: Math.random() * 8 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#10B981',
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3.5 + 2,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        opacity: 1,
      })
    }

    let animationId: number
    const startTime = performance.now()

    const render = (time: number) => {
      const elapsed = time - startTime
      ctx.clearRect(0, 0, width, height)

      let alive = false
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vRot
        p.vy += 0.08
        p.vx *= 0.99

        if (elapsed > 2200) {
          p.opacity = Math.max(0, 1 - (elapsed - 2200) / 1600)
        }

        if (p.opacity > 0 && p.y < height + 50) {
          alive = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
        }
      }

      if (alive && elapsed < 4000) {
        animationId = requestAnimationFrame(render)
      }
    }

    animationId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  )
}

/**
 * Premium Luxury Result Card Component matching 11thclassresult.com.pk house style.
 */
export function GazetteResult({
  outcome,
  boardName,
  year,
  examinationLabel,
  gazetteSourceUrl,
  gazetteCheckedOn,
  boardPageHref,
  onReset,
}: {
  outcome: LookupOutcome
  boardName: string
  year: number
  examinationLabel: string
  gazetteSourceUrl: string
  gazetteCheckedOn: string
  boardPageHref?: string
  onReset?: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  if (outcome.kind === 'invalid-request') {
    return (
      <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/90 p-5 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-bold text-rose-900">{outcome.reason}</p>
        <p className="mt-1 text-xs text-rose-700">
          Check your roll number against your admission slip and try again.
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-rose-700"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (outcome.kind === 'dataset-unavailable') {
    return (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/90 p-6 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 className="mt-3 text-base font-bold text-slate-800">
          Result Not Yet Announced / Published on Site
        </h3>
        <p className="mx-auto mt-1.5 max-w-lg text-xs leading-relaxed text-slate-600">
          {boardName}’s {examinationLabel} {year} gazette has not been published here yet. Official
          board portal may still have live updates.
        </p>
        {boardPageHref && (
          <div className="mt-4">
            <a
              href={boardPageHref}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#005B4C] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#00473B]"
            >
              <span>Open {boardName} Official Page</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        )}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mx-auto mt-3 block text-xs font-bold text-[#0069D9] hover:underline"
          >
            ← Check another board or roll number
          </button>
        )}
      </div>
    )
  }

  if (outcome.kind === 'not-found') {
    return (
      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/90 p-5 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="mt-2.5 text-sm font-bold text-amber-900">Result Not Found in Gazette</p>
        <p className="mt-1 text-xs text-amber-800">
          No entry for this roll number appears in {boardName}’s {examinationLabel} {year} gazette.
          Please verify the roll number.
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-3 text-xs font-bold text-[#0069D9] transition-colors hover:underline"
          >
            ← Try different roll number
          </button>
        )}
      </div>
    )
  }

  const record = outcome.record
  const isPassing = record.resultStatus === 'passed'
  const obtainedMarks = record.obtainedMarks
  const totalMarks = 1100

  // Calculate percentage
  let percentage = '—'
  if (obtainedMarks != null && totalMarks > 0) {
    percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2) + '%'
  }

  // Calculate grade
  let grade = '—'
  if (obtainedMarks != null && totalMarks > 0) {
    const pct = (obtainedMarks / totalMarks) * 100
    if (pct >= 80) grade = 'A+'
    else if (pct >= 70) grade = 'A'
    else if (pct >= 60) grade = 'B'
    else if (pct >= 50) grade = 'C'
    else if (pct >= 40) grade = 'D'
    else if (pct >= 33) grade = 'E'
    else grade = 'F'
  }

  const statusLabel = isPassing
    ? 'PASSED'
    : record.resultStatus === 'failed'
      ? 'NOT CLEARED'
      : record.resultStatus === 'absent'
        ? 'ABSENT'
        : 'RESULT NOTICE'

  // Copy result text to clipboard
  const handleCopy = async () => {
    const lines = [
      `🎉 12th Class (2nd Year) Result ${year}`,
      `Candidate: ${record.candidateName ?? 'Student'}`,
      `Roll No: ${record.rollNumber}`,
      `Board: ${boardName}`,
      `Status: ${statusLabel}`,
      obtainedMarks != null ? `Marks: ${obtainedMarks} / ${totalMarks} (${percentage})` : '',
      grade !== '—' ? `Grade: ${grade}` : '',
      record.institution ? `Institution: ${record.institution}` : '',
      `Verified at: https://12thclassresult.com.pk`,
    ]
      .filter(Boolean)
      .join('\n')

    try {
      await navigator.clipboard.writeText(lines)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // ignore
    }
  }

  // Share card
  const handleShare = async () => {
    const shareText = `🎉 12th Class Result - ${record.candidateName ?? 'Student'} | Roll No: ${record.rollNumber} | Marks: ${obtainedMarks ?? '—'}/${totalMarks} (${percentage}) | Grade: ${grade} | ${boardName}\n\nCheck at 12thclassresult.com.pk:`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `12th Class Result - ${record.candidateName ?? record.rollNumber}`,
          text: shareText,
          url: 'https://12thclassresult.com.pk',
        })
      } catch {
        // user cancelled
      }
    } else {
      handleCopy()
    }
  }

  // Download high-resolution card PNG
  const handleDownload = () => {
    setIsDownloading(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 760
      canvas.height = 920
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 920)
      grad.addColorStop(0, '#0F1D40')
      grad.addColorStop(0.5, '#0B1329')
      grad.addColorStop(1, '#070C1B')
      ctx.fillStyle = grad
      ctx.roundRect(0, 0, 760, 920, 32)
      ctx.fill()

      // Card Outline
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 2
      ctx.roundRect(0, 0, 760, 920, 32)
      ctx.stroke()

      // Top Bar: Watermark & Status
      ctx.fillStyle = '#94A3B8'
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('12thclassresult.com.pk', 45, 60)

      // Status Pill
      ctx.fillStyle = isPassing ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
      ctx.strokeStyle = isPassing ? '#10B981' : '#EF4444'
      ctx.lineWidth = 1.5
      ctx.roundRect(590, 38, 125, 34, 17)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = isPassing ? '#34D399' : '#F87171'
      ctx.font = '900 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(statusLabel, 652.5, 60)

      // Congratulations / Title
      ctx.fillStyle = isPassing ? '#F59E0B' : '#94A3B8'
      ctx.font = '800 14px sans-serif'
      ctx.fillText(isPassing ? '★ CONGRATULATIONS ★' : 'RESULT NOTIFICATION', 380, 130)

      // Candidate Name
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 32px sans-serif'
      const candidateText = (record.candidateName ?? `Roll No ${record.rollNumber}`).toUpperCase()
      ctx.fillText(candidateText, 380, 175)

      // Roll Number
      ctx.fillStyle = '#CBD5E1'
      ctx.font = '600 16px sans-serif'
      ctx.fillText(`Roll No ${record.rollNumber}`, 380, 210)

      // 4 Metric Boxes (2x2 Grid)
      const drawMetricBox = (
        x: number,
        y: number,
        w: number,
        h: number,
        val: string,
        label: string,
        valColor = '#FFFFFF',
      ) => {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)'
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 1.5
        ctx.roundRect(x, y, w, h, 18)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = valColor
        ctx.font = '900 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(val, x + w / 2, y + 48)

        ctx.fillStyle = '#94A3B8'
        ctx.font = '800 12px sans-serif'
        ctx.fillText(label, x + w / 2, y + 80)
      }

      drawMetricBox(
        45,
        250,
        320,
        105,
        obtainedMarks != null ? String(obtainedMarks) : '—',
        'OBTAINED',
      )
      drawMetricBox(395, 250, 320, 105, String(totalMarks), 'TOTAL')
      drawMetricBox(45, 375, 320, 105, percentage, 'PERCENTAGE', '#FBBF24')
      drawMetricBox(395, 375, 320, 105, grade, 'GRADE', '#FBBF24')

      // Board & Session
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '800 20px sans-serif'
      ctx.fillText(boardName, 380, 545)

      ctx.fillStyle = '#94A3B8'
      ctx.font = '600 15px sans-serif'
      ctx.fillText(`12th Class (2nd Year) • ${examinationLabel} ${year}`, 380, 575)

      // Dua / Blessings
      ctx.fillStyle = '#E2E8F0'
      ctx.font = 'italic 15px sans-serif'
      const dua = isPassing
        ? '“May Allah bless your future with even greater success. Pakistan is proud of you.”'
        : '“Never lose hope. Hard work and persistence will lead you to great success.”'
      ctx.fillText(dua, 380, 640)

      // Footer
      ctx.strokeStyle = '#1E293B'
      ctx.beginPath()
      ctx.moveTo(60, 720)
      ctx.lineTo(700, 720)
      ctx.stroke()

      ctx.fillStyle = '#34D399'
      ctx.font = '800 18px monospace'
      ctx.fillText('12thclassresult.com.pk', 380, 770)

      ctx.fillStyle = '#64748B'
      ctx.font = '600 13px sans-serif'
      ctx.fillText('Check your result in one tap', 380, 798)

      // Download anchor
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `12th-class-result-${record.rollNumber}.png`
        a.click()
        URL.revokeObjectURL(url)
        setIsDownloading(false)
      }, 'image/png')
    } catch {
      setIsDownloading(false)
    }
  }

  return (
    <div className="animate-in fade-in mt-6 space-y-4 duration-300">
      {/* Trigger celebratory confetti for passing result */}
      {isPassing && <ConfettiEffect />}

      {/* ── LUXURY DARK RESULT CARD ── */}
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-[#0F1D40] via-[#0B1329] to-[#070C1B] p-6 text-left text-white shadow-2xl sm:p-8">
        {/* Top Bar: Brand Watermark & Status Pill */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400">
            12thclassresult.com.pk
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-black tracking-widest uppercase ${
              isPassing
                ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'border-rose-500/40 bg-rose-500/20 text-rose-400'
            }`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Candidate & Congratulations Header */}
        <div className="mt-6 text-center">
          {isPassing ? (
            <p className="text-[11px] font-extrabold tracking-[0.25em] text-[#F59E0B] uppercase">
              ★ CONGRATULATIONS ★
            </p>
          ) : (
            <p className="text-[11px] font-extrabold tracking-[0.25em] text-slate-400 uppercase">
              RESULT NOTIFICATION
            </p>
          )}

          <h2 className="mt-2 font-serif text-2xl font-black tracking-wide text-white uppercase sm:text-3xl">
            {record.candidateName ?? `Roll No ${record.rollNumber}`}
          </h2>

          <p className="mt-1 text-xs font-semibold text-slate-300">Roll No {record.rollNumber}</p>
        </div>

        {/* 2x2 Highlight Metric Boxes */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Obtained Marks */}
          <div className="rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 text-center shadow-inner backdrop-blur-sm">
            <p className="text-2xl font-black text-white sm:text-3xl">
              {obtainedMarks != null ? obtainedMarks : '—'}
            </p>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              OBTAINED
            </p>
          </div>

          {/* Total Marks */}
          <div className="rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 text-center shadow-inner backdrop-blur-sm">
            <p className="text-2xl font-black text-white sm:text-3xl">{totalMarks}</p>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              TOTAL
            </p>
          </div>

          {/* Percentage */}
          <div className="rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 text-center shadow-inner backdrop-blur-sm">
            <p className="text-2xl font-black text-[#FBBF24] sm:text-3xl">{percentage}</p>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              PERCENTAGE
            </p>
          </div>

          {/* Grade */}
          <div className="rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 text-center shadow-inner backdrop-blur-sm">
            <p className="text-2xl font-black text-[#FBBF24] sm:text-3xl">{grade}</p>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              GRADE
            </p>
          </div>
        </div>

        {/* Board & Session Details */}
        <div className="mt-5 text-center">
          <p className="text-sm font-bold text-white">{boardName}</p>
          <p className="text-xs text-slate-400">
            12th Class (2nd Year) • {examinationLabel} {year}
          </p>
        </div>

        {/* Institution if available */}
        {record.institution ? (
          <div className="mt-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-center">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Institution
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-200">{record.institution}</p>
          </div>
        ) : null}

        {/* Failed Subjects if any */}
        {record.partIFailedSubjects.length > 0 || record.partIIFailedSubjects.length > 0 ? (
          <div className="mt-3 rounded-xl border border-rose-900/50 bg-rose-950/30 p-3 text-center text-xs">
            <p className="font-bold text-rose-300">Subjects to Clear:</p>
            {record.partIFailedSubjects.length > 0 && (
              <p className="mt-0.5 text-slate-300">
                Part-I: {record.partIFailedSubjects.join(', ')}
              </p>
            )}
            {record.partIIFailedSubjects.length > 0 && (
              <p className="mt-0.5 text-slate-300">
                Part-II: {record.partIIFailedSubjects.join(', ')}
              </p>
            )}
          </div>
        ) : null}

        {/* Motivational Blessing */}
        <p className="mt-4 text-center text-xs leading-relaxed text-slate-300/90 italic">
          {isPassing
            ? '“May Allah bless your future with even greater success. Pakistan is proud of you.”'
            : '“Never lose hope. Consistent effort and dedication lead to great success.”'}
        </p>

        {/* Card Footer Watermark */}
        <div className="mt-5 border-t border-slate-800/80 pt-4 text-center">
          <p className="font-mono text-xs font-bold tracking-wider text-emerald-400">
            12thclassresult.com.pk
          </p>
          <p className="text-[10px] text-slate-500">Check your result in one tap</p>
        </div>
      </div>

      {/* ── ACTION BUTTONS: Copy, Share, Download ── */}
      <div className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:border-[#005B4C] hover:text-[#005B4C] active:scale-95"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Result'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:border-[#005B4C] hover:text-[#005B4C] active:scale-95"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#005B4C] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#00473B] active:scale-95 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>{isDownloading ? 'Generating...' : 'Download Card'}</span>
        </button>
      </div>

      {/* Gazette Verbatim Details & Disclaimer */}
      <div className="mx-auto max-w-lg space-y-2 pt-1 text-center">
        <details className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2 text-left">
          <summary className="cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900">
            Show the gazette’s exact wording
          </summary>
          <pre className="mt-2 rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-xs whitespace-pre-wrap text-slate-600">
            {record.rawResultStatus}
          </pre>
        </details>

        <p className="text-[11px] leading-relaxed text-slate-500">
          This is a gazette notice, not a Detailed Marks Certificate. Errors and Omissions are
          EXCEPTED. Read from {boardName}’s official gazette, page {record.sourcePage}, checked{' '}
          {gazetteCheckedOn}.{' '}
          <a
            href={gazetteSourceUrl}
            rel="noopener nofollow"
            target="_blank"
            className="font-semibold text-[#0069D9] underline underline-offset-2"
          >
            Open original gazette
          </a>
        </p>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-1 text-xs font-bold text-[#0069D9] transition-colors hover:text-[#004fa8]"
          >
            ← Check another roll number
          </button>
        )}
      </div>
    </div>
  )
}
