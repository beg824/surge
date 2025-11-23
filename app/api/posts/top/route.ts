import { NextRequest, NextResponse } from 'next/server'
import { getTopPostsByViews } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    const data = await getTopPostsByViews(limit, startDate, endDate)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching top posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top posts' },
      { status: 500 }
    )
  }
}

