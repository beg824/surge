import { NextRequest, NextResponse } from 'next/server'
import { getFilteredAccounts } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json()
    const accounts = await getFilteredAccounts({
      platform: filters.platform || undefined,
      account_status: filters.account_status || undefined,
      posting_status: filters.posting_status || undefined,
      min_followers: filters.min_followers ? parseInt(filters.min_followers) : undefined,
      max_followers: filters.max_followers ? parseInt(filters.max_followers) : undefined,
      min_views: filters.min_views ? parseInt(filters.min_views) : undefined,
      max_views: filters.max_views ? parseInt(filters.max_views) : undefined,
      username: filters.username || undefined,
    })
    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching filtered accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

