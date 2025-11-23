import { NextResponse } from 'next/server'
import { getCampaignStats } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stats = await getCampaignStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching campaign stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign stats' },
      { status: 500 }
    )
  }
}

