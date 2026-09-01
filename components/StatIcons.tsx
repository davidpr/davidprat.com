const shared = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "stat-icon h-8 w-8",
  "aria-hidden": true,
};

export function TrendingArrowIcon() {
  return (
    <svg {...shared}>
      <path pathLength={1} d="M 30 64 L 44 47 L 57 53 L 70 35" />
    </svg>
  );
}

export function BarChartIcon() {
  return (
    <svg {...shared}>
      <line pathLength={1} x1={32} y1={62} x2={32} y2={48} style={{ animationDelay: "0.9s" }} />
      <line pathLength={1} x1={50} y1={62} x2={50} y2={40} style={{ animationDelay: "1.05s" }} />
      <line pathLength={1} x1={68} y1={62} x2={68} y2={30} style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

export function TeamCirclesIcon() {
  return (
    <svg {...shared}>
      <circle pathLength={1} cx={30} cy={50} r={13} style={{ animationDelay: "0.9s" }} />
      <circle pathLength={1} cx={50} cy={50} r={13} style={{ animationDelay: "1.05s" }} />
      <circle pathLength={1} cx={70} cy={50} r={13} style={{ animationDelay: "1.2s" }} />
    </svg>
  );
}

export function MentorPairIcon() {
  return (
    <svg {...shared}>
      <circle pathLength={1} cx={38} cy={50} r={20} style={{ animationDelay: "0.9s" }} />
      <circle pathLength={1} cx={62} cy={50} r={20} style={{ animationDelay: "1.1s" }} />
    </svg>
  );
}

export function DocumentIcon() {
  return (
    <svg {...shared}>
      <rect pathLength={1} x={35} y={28} width={30} height={40} rx={4} style={{ animationDelay: "0.9s" }} />
      <line pathLength={1} x1={42} y1={40} x2={58} y2={40} style={{ animationDelay: "1.25s" }} />
      <line pathLength={1} x1={42} y1={52} x2={58} y2={52} style={{ animationDelay: "1.35s" }} />
    </svg>
  );
}

export function PlayButtonIcon() {
  return (
    <svg {...shared}>
      <circle pathLength={1} cx={50} cy={50} r={40} style={{ animationDelay: "0.9s" }} />
      <path pathLength={1} d="M 40 37 L 40 63 L 63 50 Z" style={{ animationDelay: "1.25s" }} />
    </svg>
  );
}

export function CheckmarkIcon() {
  return (
    <svg {...shared}>
      <circle pathLength={1} cx={50} cy={50} r={40} style={{ animationDelay: "0.9s" }} />
      <path pathLength={1} d="M 35 50 L 45 60 L 68 35" style={{ animationDelay: "1.25s" }} />
    </svg>
  );
}
