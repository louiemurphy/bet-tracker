'use client'

import { useRef } from 'react'
import { startNewLadder } from '@/app/actions'

export default function NewLadderForm() {
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await startNewLadder(formData)
    ref.current?.reset()
  }

  return (
    <div className="text-center py-8">
      <p style={{ color: '#ffffff' }} className="text-sm uppercase tracking-widest mb-6">Start a new ladder</p>
      <form ref={ref} action={handleSubmit} className="flex gap-3 justify-center items-end max-w-sm mx-auto">
        <div>
          <label style={{ color: '#ffffff' }} className="text-[10px] uppercase tracking-[0.15em] block mb-1.5 text-left">Starting ₱</label>
          <input
            name="starting_bankroll"
            type="number"
            defaultValue={1000}
            className="px-3 py-2.5 text-sm text-white w-32 focus:outline-none"
            style={{ background: '#0a1520', border: '1px solid #1e2d3d' }}
          />
        </div>
        <div>
          <label style={{ color: '#f0f0f0' }} className="text-[10px] uppercase tracking-[0.15em] block mb-1.5 text-left">Days</label>
          <input
            name="total_days"
            type="number"
            defaultValue={7}
            className="px-3 py-2.5 text-sm text-white w-20 focus:outline-none"
            style={{ background: '#0a1520', border: '1px solid #1e2d3d' }}
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-bold text-white transition-colors"
          style={{ background: '#3b82f6' }}
        >
          Start
        </button>
      </form>
    </div>
  )
}