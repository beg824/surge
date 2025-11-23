import { NextRequest, NextResponse } from 'next/server'
import { getViewsOverTime } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const data = await getViewsOverTime(days)
    // Format dates for display
    const formatted = data.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: item.views
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching views over time:', error)
    return NextResponse.json(
      { error: 'Failed to fetch views over time' },
      { status: 500 }
    )
  }
}

