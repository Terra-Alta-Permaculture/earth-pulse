interface Props {
  /** 0 = full crisis, 100 = full regeneration, 50 = equilibrium. */
  balance: number
}

export function BalanceMeter({ balance }: Props) {
  const b = Math.max(0, Math.min(100, balance))
  const leaning =
    b > 56 ? 'Regeneration leaning' : b < 44 ? 'Crisis leaning' : 'Near equilibrium'
  const leanColor =
    b > 56 ? 'text-moss-200' : b < 44 ? 'text-ember-200' : 'text-sand-300'

  return (
    <div className="card px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Planetary balance</span>
        <span className={`text-xs font-medium ${leanColor}`}>{leaning}</span>
      </div>

      <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-ember-600 via-soil-600 to-moss-600">
        {/* center equilibrium tick */}
        <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-sand-100/30" />
      </div>
      {/* marker */}
      <div className="relative mt-1 h-4">
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${b}%` }}
        >
          <div className="mx-auto h-0 w-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-sand-100" />
        </div>
      </div>

      <div className="mt-1 flex justify-between text-[0.65rem] text-sand-700">
        <span>Degradation</span>
        <span className="stat-num text-sand-300">{b}</span>
        <span>Regeneration</span>
      </div>
    </div>
  )
}
