import { NextRequest, NextResponse } from 'next/server'
import { getViewsOverTime, getEngagementRateOverTime } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    
    const [viewsData, engagementData] = await Promise.all([
      getViewsOverTime(days),
      getEngagementRateOverTime(days),
    ])

    // Combine data by date and calculate cumulative views
    const dateMap = new Map<string, { views: number; engagement: number }>()
    
    viewsData.forEach(item => {
      dateMap.set(item.date, { views: item.views, engagement: 0 })
    })
    
    engagementData.forEach(item => {
      const existing = dateMap.get(item.date) || { views: 0, engagement: 0 }
      dateMap.set(item.date, { ...existing, engagement: item.engagementRate })
    })

    // Sort by date and calculate cumulative views
    const sorted = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        ...data
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate cumulative views
    let cumulative = 0
    const combined = sorted.map(item => {
      cumulative += item.views
      return {
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: cumulative,
        engagement: item.engagement
      }
    })

    return NextResponse.json(combined)
  } catch (error) {
    console.error('Error fetching daily trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily trends' },
      { status: 500 }
    )
  }
}

