interface SparklineProps {
  values: number[]
  color: string
  className?: string
  width?: number
  height?: number
}

/** Minimal dependency-free sparkline with a soft gradient fill. */
export function Sparkline({
  values,
  color,
  className,
  width = 120,
  height = 34,
}: SparklineProps) {
  if (values.length < 2) {
    return <div className={className} style={{ width, height }} />
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)
  const pad = 3

  const pts = values.map((v, i) => {
    const x = i * stepX
    const y = pad + (height - pad * 2) * (1 - (v - min) / span)
    return [x, y] as const
  })

  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width} ${height} L0 ${height} Z`
  const gid = `spark-${color.replace('#', '')}`

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
