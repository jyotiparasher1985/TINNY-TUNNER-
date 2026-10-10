import { useCallback, useEffect, useRef, useState } from 'react'

const POSTER = import.meta.env.VITE_POSTER_IMAGE || '/images/admission-poster.jpg'

/**
 * Full-screen admission poster shown every time the site is opened.
 * Press the cross (or Escape / click the backdrop) to dismiss it and start
 * using the website.
 */
export default function PosterSplash({ src = POSTER }) {
  const [open, setOpen] = useState(true)
  const [closing, setClosing] = useState(false)
  const closeRef = useRef(null)

  const close = useCallback(() => {
    setClosing(true)
    // let the fade-out finish before unmounting
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 260)
  }, [])

  // Lock background scrolling while the poster is up.
  useEffect(() => {
    if (!open) return undefined
    document.body.classList.add('is-locked')
    closeRef.current?.focus()
    return () => document.body.classList.remove('is-locked')
  }, [open])

  // Escape closes it.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div
      className={`splash${closing ? ' splash--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Admission open 2026-27"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="splash__card">
        <button
          ref={closeRef}
          type="button"
          className="splash__close"
          onClick={close}
          aria-label="Close and continue to the website"
          title="Close"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <img className="splash__img" src={src} alt="Tiny Turners Play Way School — admissions open for session 2026-27" />
      </div>

      <div className="splash__hint">
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }} aria-hidden="true">
          👆
        </span>
        <span>
          This poster is showing now — your website is live right here beside it.
          <br />
          Press the <b>×</b> or <b>Esc</b> to browse.
        </span>
      </div>
    </div>
  )
}