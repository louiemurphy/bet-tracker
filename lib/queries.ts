import { supabase } from './supabase'
import type { Bet, BankrollEntry } from './types'

export async function getBets(): Promise<Bet[]> {
  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .order('bet_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getBankroll(): Promise<BankrollEntry[]> {
  const { data, error } = await supabase
    .from('bankroll')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getActiveLadder(): Promise<Ladder | null> {
  const { data, error } = await supabase
    .from('ladder')
    .select('*')
    .eq('status', 'active')
    .single()
  if (error) return null
  return data
}

export async function getLadderDays(ladderId: string): Promise<LadderDay[]> {
  const { data, error } = await supabase
    .from('ladder_days')
    .select('*')
    .eq('ladder_id', ladderId)
    .order('day_number', { ascending: true })
  if (error) throw error
  return data ?? []
}
export async function getLadderDayMatches(dayIds: string[]) {
  if (dayIds.length === 0) return []
  const { data, error } = await supabase
    .from('ladder_day_matches')
    .select('*')
    .in('ladder_day_id', dayIds)
  if (error) throw error
  return data ?? []
}