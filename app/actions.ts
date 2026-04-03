'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function addLadderDay(formData: FormData) {
  const ladder_id = formData.get('ladder_id') as string
  const day_number = parseInt(formData.get('day_number') as string)
  const stake = parseFloat(formData.get('stake') as string)
  const notes = formData.get('notes') as string

  // Parse matches from formData
  const matches: { match_label: string; bet_pick: string; odds: number }[] = []
  let i = 0
  while (formData.get(`match_label_${i}`)) {
    matches.push({
      match_label: formData.get(`match_label_${i}`) as string,
      bet_pick: formData.get(`bet_pick_${i}`) as string,
      odds: parseFloat(formData.get(`odds_${i}`) as string),
    })
    i++
  }

  // Total odds = multiply all match odds
  const totalOdds = matches.reduce((acc, m) => acc * m.odds, 1)
  const parlayLabel = matches.map((m) => m.match_label).join(' || ')

  // Insert the day
  const { data: dayData, error } = await supabase
    .from('ladder_days')
    .insert({
      ladder_id,
      day_number,
      match_label: parlayLabel,
      odds: parseFloat(totalOdds.toFixed(2)),
      stake,
      parlay_count: matches.length,
      notes: notes || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error || !dayData) return

  // Insert individual matches
  await supabase.from('ladder_day_matches').insert(
    matches.map((m) => ({
      ladder_day_id: dayData.id,
      match_label: m.match_label,
      bet_pick: m.bet_pick || null,
      odds: m.odds,
    }))
  )

  revalidatePath('/')
}

export async function updateLadderDay(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as 'win' | 'loss'
  const stake = parseFloat(formData.get('stake') as string)
  const odds = parseFloat(formData.get('odds') as string)
  const ladder_id = formData.get('ladder_id') as string
  const day_number = parseInt(formData.get('day_number') as string)
  const total_days = parseInt(formData.get('total_days') as string)

  const result_amount = status === 'win' ? stake * odds : 0

  await supabase
    .from('ladder_days')
    .update({ status, result_amount })
    .eq('id', id)

  // If loss → mark ladder as failed
  if (status === 'loss') {
    await supabase
      .from('ladder')
      .update({ status: 'failed', ended_at: new Date().toISOString().split('T')[0] })
      .eq('id', ladder_id)
  }

  // If win on last day → mark ladder as completed
  if (status === 'win' && day_number === total_days) {
    await supabase
      .from('ladder')
      .update({ status: 'completed', ended_at: new Date().toISOString().split('T')[0] })
      .eq('id', ladder_id)
  }

  revalidatePath('/')
}

export async function startNewLadder(formData: FormData) {
  const starting_bankroll = parseFloat(formData.get('starting_bankroll') as string)
  const total_days = parseInt(formData.get('total_days') as string)

  await supabase.from('ladder').insert({
    starting_bankroll,
    total_days,
    status: 'active',
    started_at: new Date().toISOString().split('T')[0],
  })

  revalidatePath('/')
}