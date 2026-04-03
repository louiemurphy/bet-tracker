type Props = {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div className="border border-stone-200 p-5 bg-white">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <p className={`text-3xl font-mono font-semibold tracking-tight ${accent ? 'text-emerald-600' : 'text-stone-900'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  )
}