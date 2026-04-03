import type { Bet } from '@/lib/types'

const statusStyle: Record<string, string> = {
  win: 'text-emerald-600',
  loss: 'text-red-500',
  pending: 'text-amber-500',
  push: 'text-stone-400',
  void: 'text-stone-400',
}

export default function RecentBets({ bets }: { bets: Bet[] }) {
  return (
    <div className="border border-stone-200 bg-white">
      <div className="px-5 py-4 border-b border-stone-200">
        <p className="text-[10px] uppercase tracking-widest text-stone-400">Recent Bets</p>
      </div>
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="border-b border-stone-100">
            {['Date', 'Event', 'Type', 'Odds', 'Stake', 'Profit', 'Status'].map((h) => (
              <th key={h} className="px-5 py-2 text-left text-[10px] uppercase tracking-widest text-stone-400 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bets.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-stone-400 text-xs">
                No bets yet.
              </td>
            </tr>
          )}
          {bets.map((bet) => (
            <tr key={bet.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <td className="px-5 py-3 text-stone-500 text-xs">{bet.bet_date}</td>
              <td className="px-5 py-3 text-stone-800">{bet.event ?? `${bet.sport} — ${bet.league}`}</td>
              <td className="px-5 py-3 text-stone-500 text-xs uppercase">{bet.bet_type}</td>
              <td className="px-5 py-3 text-stone-800">{bet.odds}</td>
              <td className="px-5 py-3 text-stone-800">₱{bet.stake.toLocaleString()}</td>
              <td className={`px-5 py-3 font-semibold ${bet.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {bet.profit >= 0 ? '+' : ''}₱{bet.profit.toLocaleString()}
              </td>
              <td className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold ${statusStyle[bet.status]}`}>
                {bet.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}