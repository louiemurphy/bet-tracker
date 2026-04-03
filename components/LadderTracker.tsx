import type { Ladder, LadderDay, LadderDayMatch } from '@/lib/types'
import AddDayForm from './AddDayForm'
import UpdateResultForm from './UpdateResultForm'
import NewLadderForm from './NewLadderForm'

type Props = { ladder: Ladder; days: LadderDay[]; dayMatches: LadderDayMatch[] }

export default function LadderTracker({ ladder, days, dayMatches }: Props) {
  const lastWin = [...days].reverse().find((d) => d.status === 'win')
  const currentBankroll = lastWin?.result_amount ?? ladder.starting_bankroll
  const completedDays = days.filter((d) => d.status !== 'pending').length
  const failed = ladder.status === 'failed'
  const completed = ladder.status === 'completed'
  const nextDay = days.length + 1
  const canAddDay = !failed && !completed && nextDay <= ladder.total_days && !days.find((d) => d.status === 'pending')
  const growth = ((Number(currentBankroll) - Number(ladder.starting_bankroll)) / Number(ladder.starting_bankroll)) * 100
  const allDays = Array.from({ length: ladder.total_days }, (_, i) => days.find((d) => d.day_number === i + 1) ?? null)

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #1e2d3d' }}>
      {/* Header */}
      <div style={{ background: '#131f2e', borderBottom: '1px solid #1e2d3d' }} className="px-6 py-5 flex items-center justify-between">
        <div>
          <p style={{ color: '#eff2f5' }} className="text-[11px] uppercase tracking-[0.2em] mb-1">Active Ladder</p>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            ₱{Number(ladder.starting_bankroll).toLocaleString()} <span style={{ color: '#f8f8f8' }}>→</span> {ladder.total_days} Days
          </h2>
        </div>
        <div className="text-right">
          <p style={{ color: '#fbfbfb' }} className="text-[11px] uppercase tracking-[0.2em] mb-1">Bankroll</p>
          <p className="text-3xl font-bold text-white">₱{Number(currentBankroll).toLocaleString()}</p>
          <p className="text-xs mt-0.5" style={{ color: growth >= 0 ? '#22c55e' : '#ef4444' }}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: '#0f1923', borderBottom: '1px solid #1e2d3d' }} className="px-6 py-3 flex items-center gap-4">
        <span style={{ color: '#f1f2f4' }} className="text-[11px] uppercase tracking-[0.15em] whitespace-nowrap">
          Day {completedDays} / {ladder.total_days}
        </span>
        <div className="flex-1 h-[3px] rounded-full" style={{ background: '#1e2d3d' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedDays / ladder.total_days) * 100}%`, background: failed ? '#ef4444' : '#3b82f6' }}
          />
        </div>
        {failed && <span className="text-[11px] uppercase tracking-widest font-bold" style={{ color: '#ef4444' }}>Failed</span>}
        {completed && <span className="text-[11px] uppercase tracking-widest font-bold" style={{ color: '#22c55e' }}>Completed</span>}
      </div>

      {/* Days */}
      <div style={{ background: '#0f1923' }}>
        {allDays.map((day, i) => {
          const dayNum = i + 1

          if (!day) {
            return (
              <div key={dayNum} className="px-6 py-4 flex items-center gap-4" style={{ borderBottom: '1px solid #141f2b' }}>
                <div className="w-7 h-7 flex items-center justify-center text-[11px] flex-shrink-0" style={{ border: '1px solid #1e2d3d', color: '#cbd5e1' }}>
                  {dayNum}
                </div>
                <p className="text-sm uppercase tracking-wider" style={{ color: '#cbd5e1' }}>Day {dayNum}</p>
              </div>
            )
          }

          const matches = dayMatches.filter((m) => m.ladder_day_id === day.id)
          const isParlay = matches.length > 1

          return (
            <div
              key={day.id}
              style={{
                borderBottom: '1px solid #141f2b',
                background: day.status === 'win' ? 'rgba(34,197,94,0.04)' : day.status === 'loss' ? 'rgba(239,68,68,0.04)' : 'transparent'
              }}
            >
              {/* Day header row */}
              <div className="px-6 pt-4 pb-2 flex items-start gap-4">
                <div
                  className="w-7 h-7 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                  style={{
                    border: `1px solid ${day.status === 'win' ? '#22c55e' : day.status === 'loss' ? '#ef4444' : '#1e2d3d'}`,
                    color: day.status === 'win' ? '#22c55e' : day.status === 'loss' ? '#ef4444' : '#94a3b8'
                  }}
                >
                  {day.day_number}
                </div>

                <div className="flex-1 min-w-0">
                  {isParlay && (
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold"
                        style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}
                      >
                        Parlay {matches.length}x
                      </span>
                      <span style={{ color: '#ffffff' }} className="text-[11px] uppercase tracking-wider">
                        Combined odds: {day.odds} · ₱{Number(day.stake).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Individual matches */}
                  <div className="space-y-1.5">
                    {matches.length > 0 ? matches.map((m, mi) => (
                      <div key={m.id} className="flex items-center gap-2">
                        {isParlay && (
                          <span style={{ color: '#f2f4f6', fontSize: 10 }} className="flex-shrink-0">#{mi + 1}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-bold text-white">{m.match_label}</span>
                          {m.bet_pick && (
                            <span
                              className="ml-2 text-[10px] uppercase tracking-widest px-1.5 py-0.5 font-bold"
                              style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid #1e2d3d' }}
                            >
                              {m.bet_pick}
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#94a3b8' }} className="text-[11px] flex-shrink-0">{m.odds}</span>
                      </div>
                    )) : (
                      <>
                        <p className="text-sm font-bold text-white">{day.match_label}</p>
                        <p style={{ color: '#94a3b8' }} className="text-[11px] uppercase tracking-wider">
                          Odds {day.odds} · ₱{Number(day.stake).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>

                  {!isParlay && matches.length > 0 && (
                    <p style={{ color: '#94a3b8' }} className="text-[11px] uppercase tracking-wider mt-1">
                      Odds {day.odds} · ₱{Number(day.stake).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Result / buttons */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  {day.status === 'pending' ? (
                    <UpdateResultForm
                      dayId={day.id}
                      ladderId={ladder.id}
                      dayNumber={day.day_number}
                      totalDays={ladder.total_days}
                      stake={day.stake}
                      odds={day.odds}
                    />
                  ) : (
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: day.status === 'win' ? '#22c55e' : '#ef4444' }}>
                        {day.status === 'win'
                          ? `+₱${(Number(day.result_amount) - Number(day.stake)).toLocaleString()}`
                          : `-₱${Number(day.stake).toLocaleString()}`}
                      </p>
                      {day.status === 'win' && day.result_amount && (
                        <p className="text-[11px]" style={{ color: '#94a3b8' }}>→ ₱{Number(day.result_amount).toLocaleString()}</p>
                      )}
                    </div>
                  )}

                  <div
                    className="px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] font-bold"
                    style={{
                      border: `1px solid ${day.status === 'win' ? 'rgba(34,197,94,0.3)' : day.status === 'loss' ? 'rgba(239,68,68,0.3)' : '#1e2d3d'}`,
                      color: day.status === 'win' ? '#22c55e' : day.status === 'loss' ? '#ef4444' : '#94a3b8',
                      background: day.status === 'win' ? 'rgba(34,197,94,0.08)' : day.status === 'loss' ? 'rgba(239,68,68,0.08)' : 'transparent'
                    }}
                  >
                    {day.status}
                  </div>
                </div>
              </div>

              {/* Bottom padding */}
              <div className="pb-3" />
            </div>
          )
        })}
      </div>

      {/* Add day */}
      {canAddDay && (
        <div style={{ background: '#0f1923', borderTop: '1px solid #1e2d3d' }} className="px-6 py-4">
          <AddDayForm ladderId={ladder.id} nextDay={nextDay} currentBankroll={currentBankroll} />
        </div>
      )}

      {/* Failed */}
      {failed && (
        <div style={{ background: '#0f1923', borderTop: '1px solid #1e2d3d' }} className="px-6 py-5">
          <NewLadderForm />
        </div>
      )}

      {/* Completed */}
      {completed && (
        <div style={{ background: 'rgba(34,197,94,0.05)', borderTop: '1px solid rgba(34,197,94,0.15)' }} className="px-6 py-5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#22c55e' }}>Ladder Complete</p>
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Final bankroll: ₱{Number(currentBankroll).toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}