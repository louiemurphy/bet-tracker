'use client'

import { updateLadderDay } from '@/app/actions'

type Props = {
  dayId: string
  ladderId: string
  dayNumber: number
  totalDays: number
  stake: number
  odds: number
}

export default function UpdateResultForm({ dayId, ladderId, dayNumber, totalDays, stake, odds }: Props) {
  return (
    <div className="flex gap-2">
      <form action={updateLadderDay}>
        <input type="hidden" name="id" value={dayId} />
        <input type="hidden" name="ladder_id" value={ladderId} />
        <input type="hidden" name="day_number" value={dayNumber} />
        <input type="hidden" name="total_days" value={totalDays} />
        <input type="hidden" name="stake" value={stake} />
        <input type="hidden" name="odds" value={odds} />
        <input type="hidden" name="status" value="win" />
        <button
          type="submit"
          className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-bold transition-colors"
          style={{ border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', background: 'rgba(34,197,94,0.08)' }}
        >
          Win
        </button>
      </form>
      <form action={updateLadderDay}>
        <input type="hidden" name="id" value={dayId} />
        <input type="hidden" name="ladder_id" value={ladderId} />
        <input type="hidden" name="day_number" value={dayNumber} />
        <input type="hidden" name="total_days" value={totalDays} />
        <input type="hidden" name="stake" value={stake} />
        <input type="hidden" name="odds" value={odds} />
        <input type="hidden" name="status" value="loss" />
        <button
          type="submit"
          className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-bold transition-colors"
          style={{ border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}
        >
          Loss
        </button>
      </form>
    </div>
  )
}