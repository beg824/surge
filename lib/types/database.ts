// Database types based on Supabase schema

export interface Account {
  account_id: string
  platform: 'tiktok' | 'instagram' | 'facebook' | 'X' | 'youtube'
  username: string
  account_niche: string | null
  pfp_url: string | null
  email: string | null
  password: string | null
  phone: string | null
  created_at: string
  updated_at: string
  account_status: string | null
  posting_status: string | null
  display_name: string | null
  profile_url: string | null
  bio: string | null
  post_to_feed: boolean
  followers_count: number | null
  media_count: number | null
  profile_views: number | null
  reach_count: number | null
  views_count_total: number | null
  likes_count_total: number | null
  comments_count_total: number | null
  shares_count_total: number | null
  audience_age_breakdown: Record<string, any> | null
  audience_gender_breakdown: Record<string, any> | null
  audience_country_breakdown: Record<string, any> | null
  airtable_record_id: string | null
  api_profile_key: string | null
  api_user_profile: string | null
}

export interface TikTokPosting {
  post_id: string
  video_id: string | null
  surge_date: string | null
  account_id: string
  video_category: string | null
  scheduled_date: string | null
  posted_link: string | null
  gdrive_link: string | null
  upload_id: string | null
  api_post_id: string | null
  post_caption: string | null
  views: number | null
  likes: number | null
  comments: number | null
  shares: number | null
  client_id: number | null
}

export interface Client {
  client_id: number
  created_at: string
  password: string | null
  campaign: string | null
  status: string | null
}

// Joined types for queries
export interface TikTokPostingWithAccount extends TikTokPosting {
  accounts: Account | null
}

export interface TikTokPostingWithAccountAndClient extends TikTokPosting {
  accounts: Account | null
  clients: Client | null
}

export interface AccountWithStats extends Account {
  post_count?: number
  total_views?: number
  total_likes?: number
  total_comments?: number
  total_shares?: number
}
