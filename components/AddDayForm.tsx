'use client'

import { useRef, useState } from 'react'
import { addLadderDay } from '@/app/actions'

type Props = { ladderId: string; nextDay: number; currentBankroll: number | string }

type Match = { match_label: string; bet_pick: string; odds: string }

export default function AddDayForm({ ladderId, nextDay, currentBankroll }: Props) {
  const [open, setOpen] = useState(false)
  const [matches, setMatches] = useState<Match[]>([{ match_label: '', bet_pick: '', odds: '' }])
  const ref = useRef<HTMLFormElement>(null)

  const totalOdds = matches.reduce((acc, m) => {
    const o = parseFloat(m.odds)
    return isNaN(o) ? acc : acc * o
  }, 1)

  const validOdds = matches.every((m) => !isNaN(parseFloat(m.odds)) && parseFloat(m.odds) > 0)

  function addMatch() {
    setMatches([...matches, { match_label: '', bet_pick: '', odds: '' }])
  }

  function removeMatch(index: number) {
    if (matches.length === 1) return
    setMatches(matches.filter((_, i) => i !== index))
  }

  function updateMatch(index: number, field: keyof Match, value: string) {
    const updated = [...matches]
    updated[index][field] = value
    setMatches(updated)
  }

  async function handleSubmit(formData: FormData) {
    await addLadderDay(formData)
    ref.current?.reset()
    setMatches([{ match_label: '', bet_pick: '', odds: '' }])
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-colors"
        style={{ border: '1px dashed #1e2d3d', color: '#94a3b8', background: 'transparent' }}
      >
        + Log Day {nextDay}
      </button>
    )
  }

  return (
    <div>
      <p style={{ color: '#94a3b8' }} className="text-[11px] uppercase tracking-[0.2em] mb-4">
        Log Day {nextDay}
      </p>
      <form ref={ref} action={handleSubmit} className="space-y-4">
        <input type="hidden" name="ladder_id" value={ladderId} />
        <input type="hidden" name="day_number" value={nextDay} />
        <input type="hidden" name="stake" value={currentBankroll} />
        {matches.map((m, i) => (
          <input key={`hidden_label_${i}`} type="hidden" name={`match_label_${i}`} value={m.match_label} />
        ))}
        {matches.map((m, i) => (
          <input key={`hidden_pick_${i}`} type="hidden" name={`bet_pick_${i}`} value={m.bet_pick} />
        ))}
        {matches.map((m, i) => (
          <input key={`hidden_odds_${i}`} type="hidden" name={`odds_${i}`} value={m.odds} />
        ))}

        {/* Match rows */}
        <div className="space-y-3">
          {matches.map((m, i) => (
            <div key={i} style={{ background: '#0a1520', border: '1px solid #1e2d3d', padding: '12px' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest">
                  Match {i + 1}
                </span>
                {matches.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMatch(i)}
                    style={{ color: '#ef4444', fontSize: 11 }}
                    className="uppercase tracking-widest"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest block mb-1">
                    Match *
                  </label>
                  <input
                    required
                    value={m.match_label}
                    onChange={(e) => updateMatch(i, 'match_label', e.target.value)}
                    placeholder="e.g. Lecce vs Atalanta"
                    className="w-full px-3 py-2 text-sm text-white focus:outline-none"
                    style={{ background: '#131f2e', border: '1px solid #1e2d3d' }}
                  />
                </div>
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest block mb-1">
                    Bet Pick
                  </label>
                  <input
                    value={m.bet_pick}
                    onChange={(e) => updateMatch(i, 'bet_pick', e.target.value)}
                    placeholder="e.g. Over 1.5"
                    className="w-full px-3 py-2 text-sm text-white focus:outline-none"
                    style={{ background: '#131f2e', border: '1px solid #1e2d3d' }}
                  />
                </div>
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest block mb-1">
                    Odds *
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={m.odds}
                    onChange={(e) => updateMatch(i, 'odds', e.target.value)}
                    placeholder="1.50"
                    className="w-full px-3 py-2 text-sm text-white focus:outline-none"
                    style={{ background: '#131f2e', border: '1px solid #1e2d3d' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add match button */}
        <button
          type="button"
          onClick={addMatch}
          className="w-full py-2 text-[11px] uppercase tracking-widest transition-colors"
          style={{ border: '1px dashed #1e2d3d', color: '#94a3b8' }}
        >
          + Add Another Match
        </button>

        {/* Total odds + stake */}
        <div className="flex items-center justify-between px-3 py-2.5" style={{ background: '#0a1520', border: '1px solid #1e2d3d' }}>
          <div>
            <p style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest">Total Odds</p>
            <p className="text-lg font-bold text-white">{validOdds ? totalOdds.toFixed(2) : '—'}</p>
          </div>
          <div className="text-right">
            <p style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest">Stake</p>
            <p className="text-lg font-bold" style={{ color: '#3b82f6' }}>₱{Number(currentBankroll).toLocaleString()}</p>
          </div>
          {validOdds && (
            <div className="text-right">
              <p style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest">Potential Win</p>
              <p className="text-lg font-bold" style={{ color: '#22c55e' }}>
                ₱{(Number(currentBankroll) * totalOdds).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label style={{ color: '#94a3b8' }} className="text-[10px] uppercase tracking-widest block mb-1.5">Notes</label>
          <input
            name="notes"
            placeholder="Optional"
            className="w-full px-3 py-2.5 text-sm text-white focus:outline-none"
            style={{ background: '#0a1520', border: '1px solid #1e2d3d' }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2.5 text-[11px] uppercase tracking-[0.2em] font-bold text-white"
            style={{ background: '#3b82f6' }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setMatches([{ match_label: '', bet_pick: '', odds: '' }]) }}
            className="flex-1 py-2.5 text-[11px] uppercase tracking-[0.2em] font-bold"
            style={{ border: '1px solid #1e2d3d', color: '#94a3b8' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}