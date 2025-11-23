import { NextRequest, NextResponse } from 'next/server'
import { getDailyPostsBreakdown } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const data = await getDailyPostsBreakdown(days)
    // Format dates for display
    const formatted = data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: item.count
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching daily breakdown:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily breakdown' },
      { status: 500 }
    )
  }
}

