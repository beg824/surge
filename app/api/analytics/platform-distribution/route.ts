import { NextResponse } from 'next/server'
import { getAllAccounts } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const accounts = await getAllAccounts()
    
    const platformMap = new Map<string, number>()
    
    accounts.forEach(acc => {
      const existing = platformMap.get(acc.platform) || 0
      platformMap.set(acc.platform, existing + 1)
    })

    const distribution = Array.from(platformMap.entries())
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))

    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error fetching platform distribution:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform distribution' },
      { status: 500 }
    )
  }
}

