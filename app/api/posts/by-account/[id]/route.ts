import { NextRequest, NextResponse } from 'next/server'
import { getTikTokPostsByAccount } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const posts = await getTikTokPostsByAccount(params.id)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

