import { NextRequest, NextResponse } from 'next/server'
import { getCampaignStats, getTikTokPostsWithClient } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id)
    const [campaigns, allPosts] = await Promise.all([
      getCampaignStats(),
      getTikTokPostsWithClient(),
    ])

    const campaign = campaigns.find(c => c.clientId === clientId)
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Get all posts for this campaign
    const campaignPosts = allPosts.filter(post => post.client_id === clientId)

    return NextResponse.json({
      ...campaign,
      posts: campaignPosts
    })
  } catch (error) {
    console.error('Error fetching campaign:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}

