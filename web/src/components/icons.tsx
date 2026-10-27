// Inline stroke icons shared across the app.
// They use currentColor, so they take the text colour of whatever wraps them.
type IconProps = { className?: string };

export const IconPencil = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19 3 20l1-4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconChevronRight = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M9 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconHome = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M3 10.5L12 3l9 7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 9.5V19a1 1 0 001 1h4v-5a1 1 0 011-1h2a1 1 0 011 1v5h4a1 1 0 001-1V9.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconUpload = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 8l-5-5-5 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 3v12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const IconSearch = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <circle
      cx="11"
      cy="11"
      r="7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M20 20l-3.5-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const IconFolder = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M3 7h6l2 2h10v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 7V5a2 2 0 012-2h5l2 2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconLogout = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M10 17l5-5-5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12H4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 4v16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const IconMoon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M21 14.5A8.5 8.5 0 019.5 3a7 7 0 1011.5 11.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSun = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M19.5 4.5l-2.1 2.1M6.6 17.4l-2.1 2.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
