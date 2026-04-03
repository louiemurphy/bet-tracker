export type Bet = {
  id: string
  bet_date: string
  sport: string
  league: string | null
  event: string | null
  bet_type: string
  odds: number
  stake: number
  status: 'pending' | 'win' | 'loss' | 'push' | 'void'
  payout: number
  profit: number
  strategy: string | null
  confidence: number | null
  notes: string | null
  created_at: string
}

export type BankrollEntry = {
  id: string
  amount: number
  type: 'initial' | 'deposit' | 'withdrawal'
  note: string | null
  created_at: string
}

export type Ladder = {
  id: string
  starting_bankroll: number
  target_bankroll: number | null
  total_days: number
  status: 'active' | 'failed' | 'completed'
  started_at: string
  ended_at: string | null
  created_at: string
}

export type LadderDay = {
  id: string
  ladder_id: string
  day_number: number
  match_label: string
  sport: string | null
  odds: number
  stake: number
  result_amount: number | null
  status: 'pending' | 'win' | 'loss'
  bet_date: string
  notes: string | null
  created_at: string
}

export type LadderDayMatch = {
  id: string
  ladder_day_id: string
  match_label: string
  bet_pick: string | null
  odds: number
  created_at: string
}