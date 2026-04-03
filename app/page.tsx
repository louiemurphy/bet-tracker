import { supabase } from '@/lib/supabase'
import LadderTracker from '@/components/LadderTracker'
import NewLadderForm from '@/components/NewLadderForm'

export const revalidate = 0

export default async function Dashboard() {
  const { data } = await supabase.from('ladder').select('*').eq('status', 'active')
  const ladder = data?.[0] ?? null

  const ladderDays = ladder
    ? (await supabase.from('ladder_days').select('*').eq('ladder_id', ladder.id).order('day_number', { ascending: true })).data ?? []
    : []

  const dayIds = ladderDays.map((d) => d.id)
  const dayMatches = dayIds.length > 0
    ? (await supabase.from('ladder_day_matches').select('*').in('ladder_day_id', dayIds)).data ?? []
    : []

  return (
    <main className="min-h-screen" style={{ background: '#0f1923', fontFamily: 'var(--font-raj), sans-serif' }}>
      <div style={{ borderBottom: '1px solid #1e2d3d' }} className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-widest uppercase">Bet Tracker</h1>
          <p style={{ color: '#94a3b8' }} className="text-[11px] uppercase tracking-[0.2em] mt-0.5">Personal record</p>
        </div>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6' }} />
      </div>

      <div className="px-8 py-8 max-w-3xl mx-auto">
        {ladder ? (
          <LadderTracker ladder={ladder} days={ladderDays} dayMatches={dayMatches} />
        ) : (
          <div style={{ border: '1px solid #1e2d3d', background: '#131f2e', borderRadius: 12 }}>
            <NewLadderForm />
          </div>
        )}
      </div>
    </main>
  )
}