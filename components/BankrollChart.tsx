'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  data: { date: string; bankroll: number }[]
}

export default function BankrollChart({ data }: Props) {
  const customTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div
          style={{
            border: '1px solid #e7e5e4',
            borderRadius: 0,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            backgroundColor: '#fff',
            padding: '8px',
          }}
        >
          <p>{`Bankroll: ₱${value?.toLocaleString() || '₱0'}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="border border-stone-200 bg-white p-5">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">Bankroll Over Time</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            tickLine={false}
            axisLine={false}
            width={60}
            tickFormatter={(v) => `₱${v.toLocaleString()}`}
          />
          <Tooltip content={customTooltip} />
          <Line
            type="monotone"
            dataKey="bankroll"
            stroke="#10b981"
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}