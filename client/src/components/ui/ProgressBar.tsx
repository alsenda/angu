interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  color?: 'blue' | 'green';
}

export default function ProgressBar({ value, max = 100, showLabel, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <span className={`progress-wrapper ${className}`.trim()}>
      <span className="progress-bar">
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </span>
      {showLabel && <span className="progress-label">{pct}%</span>}
    </span>
  );
}
