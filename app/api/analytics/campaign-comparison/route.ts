import { NextResponse } from 'next/server'
import { getCampaignStats } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const campaigns = await getCampaignStats()
    
    const comparison = campaigns.map(campaign => {
      const campaignName = campaign.campaign || `Client ${campaign.clientId}`
      // Extract artist name (everything after the last "-")
      const lastDashIndex = campaignName.lastIndexOf(' - ')
      const artistName = lastDashIndex !== -1 
        ? campaignName.substring(lastDashIndex + 3).trim() 
        : campaignName // If no "-" found, use the full name
      
      return {
        campaign: artistName,
        views: campaign.totalViews
      }
    })
    .sort((a, b) => b.views - a.views)

    return NextResponse.json(comparison)
  } catch (error) {
    console.error('Error fetching campaign comparison:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign comparison' },
      { status: 500 }
    )
  }
}

