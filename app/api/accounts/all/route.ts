import { NextResponse } from 'next/server'
import { getAllAccounts } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const accounts = await getAllAccounts()
    
    // Debug logging
    console.log('Fetched accounts count:', accounts?.length)
    if (accounts && accounts.length > 0) {
      console.log('First account sample:', {
        username: accounts[0].username,
        views_count_total: accounts[0].views_count_total,
        likes_count_total: accounts[0].likes_count_total,
        media_count: accounts[0].media_count
      })
      console.log('Second account sample:', {
        username: accounts[1]?.username,
        views_count_total: accounts[1]?.views_count_total,
        likes_count_total: accounts[1]?.likes_count_total,
        media_count: accounts[1]?.media_count
      })
    }
    
    return NextResponse.json(accounts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

