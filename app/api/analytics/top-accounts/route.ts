import { NextRequest, NextResponse } from 'next/server'
import { getAccountsWithStats } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const accounts = await getAccountsWithStats()
    
    const accountsWithEngagement = accounts.map(acc => ({
      username: acc.username,
      platform: acc.platform,
      engagement: (acc.total_likes || 0) + (acc.total_comments || 0) + (acc.total_shares || 0)
    }))
    
    const sorted = accountsWithEngagement
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, limit)

    return NextResponse.json(sorted)
  } catch (error) {
    console.error('Error fetching top accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top accounts' },
      { status: 500 }
    )
  }
}

