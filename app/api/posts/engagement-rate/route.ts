import { NextRequest, NextResponse } from 'next/server'
import { getEngagementRateOverTime } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const data = await getEngagementRateOverTime(days)
    // Format dates for display and keep engagement rate as decimal (e.g., 0.10 for 10%)
    const formatted = data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      engagementRate: Number(item.engagementRate.toFixed(4)) // Keep 4 decimal places
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching engagement rate:', error)
    return NextResponse.json(
      { error: 'Failed to fetch engagement rate' },
      { status: 500 }
    )
  }
}

