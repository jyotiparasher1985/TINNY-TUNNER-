/** Minimal inline icon set (stroke-based, inherits currentColor). */

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Icon({ children, size = 18, ...rest }) {
  return (
    <svg {...base} width={size} height={size} aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export const Phone = (p) => (
  <Icon {...p}>
    <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />
  </Icon>
)

export const Pin = (p) => (
  <Icon {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Icon>
)

export const Mail = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Icon>
)

export const Clock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Icon>
)

export const WhatsApp = ({ size = 18, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.53 3.68 1.45 5.2L2 22l5.1-1.6a9.8 9.8 0 0 0 4.94 1.32h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.03-5.1-2.9-6.96A9.78 9.78 0 0 0 12.04 2Zm0 1.87c2.15 0 4.17.84 5.69 2.36a7.97 7.97 0 0 1 2.36 5.61c0 4.42-3.6 8.01-8.04 8.01a8 8 0 0 1-4.07-1.11l-.29-.17-3.03.95.96-2.95-.19-.3a7.94 7.94 0 0 1-1.22-4.32c0-4.42 3.6-8.08 7.83-8.08Zm-3.2 4.2c-.15 0-.4.06-.6.3-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.93 2.35.11.15 1.6 2.56 3.94 3.49 1.95.78 2.34.62 2.77.58.42-.04 1.36-.55 1.55-1.09.19-.54.19-1 .13-1.1-.06-.1-.21-.16-.44-.28-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.52.12-.15.23-.6.75-.73.9-.13.15-.27.17-.5.06-.23-.12-.97-.36-1.85-1.14-.68-.61-1.15-1.36-1.28-1.59-.13-.23-.02-.35.1-.47.1-.1.23-.27.34-.4.12-.15.15-.25.23-.41.08-.17.04-.31-.02-.44-.06-.12-.5-1.26-.7-1.72-.18-.45-.36-.39-.5-.4h-.42Z" />
  </svg>
)

export const ArrowRight = (p) => (
  <Icon {...p}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </Icon>
)

export const Play = (p) => (
  <Icon {...p}>
    <path d="M8 5.5v13l10-6.5-10-6.5Z" />
  </Icon>
)

export const Check = (p) => (
  <Icon {...p}>
    <path d="m4.5 12.5 4.5 4.5L19.5 7" />
  </Icon>
)

export const Shield = (p) => (
  <Icon {...p}>
    <path d="M12 3 5 6v5.5c0 4.3 2.9 8.1 7 9.5 4.1-1.4 7-5.2 7-9.5V6l-7-3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Icon>
)

export const Users = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.4a3.2 3.2 0 0 1 0 6.2M17.5 14.6A5.5 5.5 0 0 1 20.5 20" />
  </Icon>
)

export const Sparkles = (p) => (
  <Icon {...p}>
    <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.5l-1.6-5.3L5 10.6 10.4 9 12 3.5Z" />
    <path d="M18.5 15.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
  </Icon>
)

export const Bus = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="11" rx="2.5" />
    <path d="M3 10.5h18M8 16v2M16 16v2" />
    <circle cx="7.5" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="16.5" cy="13" r="1" fill="currentColor" stroke="none" />
  </Icon>
)

export const Heart = (p) => (
  <Icon {...p}>
    <path d="M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7c0 4.9-7 9.3-7 9.3Z" />
  </Icon>
)

export const Book = (p) => (
  <Icon {...p}>
    <path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 0-3 3V4.5Z" />
    <path d="M17 7.5h2v13" />
  </Icon>
)

export const Calendar = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
)

export const Camera = (p) => (
  <Icon {...p}>
    <path d="M4 8.5h3.2l1.4-2.2h6.8l1.4 2.2H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z" />
    <circle cx="12" cy="13.5" r="3.3" />
  </Icon>
)

export const Close = (p) => (
  <Icon {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
)

export const Menu = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
)

export const Search = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
)

export const Filter = (p) => (
  <Icon {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Icon>
)