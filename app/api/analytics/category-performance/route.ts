import { NextResponse } from 'next/server'
import { getTikTokPostsWithClient } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const posts = await getTikTokPostsWithClient()
    
    const categoryMap = new Map<string, number>()
    
    posts.forEach(post => {
      const category = post.video_category || 'Uncategorized'
      const existing = categoryMap.get(category) || 0
      categoryMap.set(category, existing + (post.views || 0))
    })

    const performance = Array.from(categoryMap.entries())
      .map(([category, views]) => ({ category, views }))
      .sort((a, b) => b.views - a.views)

    return NextResponse.json(performance)
  } catch (error) {
    console.error('Error fetching category performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category performance' },
      { status: 500 }
    )
  }
}

