'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  data: { date: string; bankroll: number }[]
}

export default function BankrollChart({ data }: Props) {
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
          <Tooltip
            formatter={(v: number) => [`₱${v.toLocaleString()}`, 'Bankroll']}
            contentStyle={{
              border: '1px solid #e7e5e4',
              borderRadius: 0,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
            }}
          />
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