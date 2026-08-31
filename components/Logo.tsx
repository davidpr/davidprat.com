// Circuit-cloud mark — successor of the old davidprat.com logo, redrawn as an
// SVG in the site's violet→cyan palette.
export function LogoMark({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* cloud outline */}
      <path
        d="M 95 70 H 28 A 18 18 0 1 1 32 34 A 26 26 0 0 1 82 26 A 20 20 0 1 1 95 70 Z"
        stroke="url(#logo-grad)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* circuit traces */}
      <g stroke="url(#logo-grad)" strokeWidth="3" strokeLinecap="round">
        <path d="M 35 56 H 50 V 44 H 60" />
        <path d="M 46 63 H 70 V 52" />
        <path d="M 57 32 V 40 H 74" />
        <path d="M 80 60 H 88" />
      </g>
      <g fill="#06b6d4">
        <circle cx="63" cy="44" r="3.5" />
        <circle cx="70" cy="49" r="3.5" />
        <circle cx="77" cy="40" r="3.5" />
        <circle cx="91" cy="60" r="3.5" />
      </g>
    </svg>
  );
}
