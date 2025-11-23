import { supabase } from './client'
import type { Account, TikTokPosting, Client, TikTokPostingWithAccount, TikTokPostingWithAccountAndClient, AccountWithStats } from '@/lib/types/database'

// Accounts queries
export async function getAllAccounts() {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Account[]
}

export async function getAccountsByPlatform(platform: string) {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('platform', platform)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Account[]
}

export async function getAccountById(accountId: string) {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('account_id', accountId)
    .single()

  if (error) throw error
  return data as Account
}

export async function getFilteredAccounts(filters: {
  platform?: string
  account_status?: string
  posting_status?: string
  min_followers?: number
  max_followers?: number
  min_views?: number
  max_views?: number
  username?: string
}) {
  let query = supabase.from('accounts').select('*')

  if (filters.platform) {
    query = query.eq('platform', filters.platform)
  }
  if (filters.account_status) {
    query = query.eq('account_status', filters.account_status)
  }
  if (filters.posting_status) {
    query = query.eq('posting_status', filters.posting_status)
  }
  if (filters.min_followers !== undefined) {
    query = query.gte('followers_count', filters.min_followers)
  }
  if (filters.max_followers !== undefined) {
    query = query.lte('followers_count', filters.max_followers)
  }
  if (filters.min_views !== undefined) {
    query = query.gte('views_count_total', filters.min_views)
  }
  if (filters.max_views !== undefined) {
    query = query.lte('views_count_total', filters.max_views)
  }
  if (filters.username) {
    query = query.ilike('username', `%${filters.username}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Account[]
}

// TikTok Posting queries
export async function getAllTikTokPosts() {
  const { data, error } = await supabase
    .from('tiktok_posting')
    .select(`
      *,
      accounts (*)
    `)
    .order('surge_date', { ascending: false })

  if (error) throw error
  return data as TikTokPostingWithAccount[]
}

export async function getTikTokPostsWithClient() {
  const { data, error } = await supabase
    .from('tiktok_posting')
    .select(`
      *,
      accounts (*),
      clients (*)
    `)
    .order('surge_date', { ascending: false })

  if (error) throw error
  return data as TikTokPostingWithAccountAndClient[]
}

export async function getTikTokPostsByAccount(accountId: string) {
  const { data, error } = await supabase
    .from('tiktok_posting')
    .select(`
      *,
      accounts (*),
      clients (*)
    `)
    .eq('account_id', accountId)
    .order('surge_date', { ascending: false })

  if (error) throw error
  return data as TikTokPostingWithAccountAndClient[]
}

export async function getTopPostsByViews(limit: number = 20, startDate?: string, endDate?: string) {
  let query = supabase
    .from('tiktok_posting')
    .select(`
      *,
      accounts (*),
      clients (*)
    `)
    .order('views', { ascending: false })
    .limit(limit)

  if (startDate) {
    query = query.gte('surge_date', startDate)
  }
  if (endDate) {
    query = query.lte('surge_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error
  return data as TikTokPostingWithAccountAndClient[]
}

export async function getTikTokPostsByDateRange(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('tiktok_posting')
    .select(`
      *,
      accounts (*),
      clients (*)
    `)
    .gte('surge_date', startDate)
    .lte('surge_date', endDate)
    .order('surge_date', { ascending: false })

  if (error) throw error
  return data as TikTokPostingWithAccountAndClient[]
}

export async function getFilteredPosts(filters: {
  startDate?: string
  endDate?: string
  accountId?: string
  clientId?: number
  videoCategory?: string
  search?: string
}) {
  let query = supabase
    .from('tiktok_posting')
    .select(`
      *,
      accounts (*),
      clients (*)
    `)

  if (filters.startDate) {
    query = query.gte('surge_date', filters.startDate)
  }
  if (filters.endDate) {
    query = query.lte('surge_date', filters.endDate)
  }
  if (filters.accountId) {
    query = query.eq('account_id', filters.accountId)
  }
  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId)
  }
  if (filters.videoCategory) {
    query = query.eq('video_category', filters.videoCategory)
  }
  if (filters.search) {
    query = query.or(`video_id.ilike.%${filters.search}%,post_caption.ilike.%${filters.search}%`)
  }

  const { data, error } = await query.order('surge_date', { ascending: false })

  if (error) throw error
  return data as TikTokPostingWithAccountAndClient[]
}

// Clients queries
export async function getAllClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Client[]
}

export async function getClientById(clientId: number) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('client_id', clientId)
    .single()

  if (error) throw error
  return data as Client
}

// Analytics queries
export async function getDailyPostsBreakdown(days: number = 30) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('tiktok_posting')
    .select('scheduled_date')
    .gte('scheduled_date', startDate.toISOString().split('T')[0])
    .lte('scheduled_date', endDate.toISOString().split('T')[0])
    .not('scheduled_date', 'is', null)

  if (error) throw error

  // Group by date
  const dateMap = new Map<string, number>()
  data?.forEach(post => {
    if (post.scheduled_date) {
      // Normalize date to YYYY-MM-DD format
      const dateStr = post.scheduled_date.includes('T') 
        ? post.scheduled_date.split('T')[0] 
        : post.scheduled_date
      const count = dateMap.get(dateStr) || 0
      dateMap.set(dateStr, count + 1)
    }
  })

  // Fill in all dates in the range, even if they have 0 posts
  const result: { date: string; count: number }[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    result.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

export async function getViewsOverTime(days: number = 30) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('tiktok_posting')
    .select('surge_date, views')
    .gte('surge_date', startDate.toISOString().split('T')[0])
    .lte('surge_date', endDate.toISOString().split('T')[0])
    .not('surge_date', 'is', null)

  if (error) throw error

  const dateMap = new Map<string, number>()
  data?.forEach(post => {
    if (post.surge_date) {
      const total = dateMap.get(post.surge_date) || 0
      dateMap.set(post.surge_date, total + (post.views || 0))
    }
  })

  return Array.from(dateMap.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export async function getEngagementRateOverTime(days: number = 30) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('tiktok_posting')
    .select('surge_date, likes, comments, shares, views')
    .gte('surge_date', startDate.toISOString().split('T')[0])
    .lte('surge_date', endDate.toISOString().split('T')[0])
    .not('surge_date', 'is', null)

  if (error) throw error

  // Calculate average engagement rate per post for each date
  const dateMap = new Map<string, { rates: number[] }>()
  data?.forEach(post => {
    if (post.surge_date && post.views && post.views > 0) {
      const existing = dateMap.get(post.surge_date) || { rates: [] }
      const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0)
      const views = post.views
      const rate = engagement / views
      existing.rates.push(rate)
      dateMap.set(post.surge_date, existing)
    }
  })

  return Array.from(dateMap.entries())
    .map(([date, { rates }]) => {
      const avgRate = rates.length > 0 
        ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length 
        : 0
      return {
        date,
        engagementRate: avgRate
      }
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export async function getCampaignStats() {
  const { data: posts, error } = await supabase
    .from('tiktok_posting')
    .select(`
      *,
      clients (*)
    `)
    .not('client_id', 'is', null)

  if (error) throw error

  const campaignMap = new Map<number, {
    campaign: string
    status: string
    posts: TikTokPostingWithAccountAndClient[]
    totalViews: number
    totalLikes: number
    totalComments: number
    totalShares: number
    dates: string[]
  }>()

  posts?.forEach(post => {
    if (!post.client_id || !post.clients) return

    const existing = campaignMap.get(post.client_id) || {
      campaign: post.clients.campaign || `Client ${post.client_id}`,
      status: post.clients.status || 'unknown',
      posts: [],
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      dates: []
    }

    existing.posts.push(post as TikTokPostingWithAccountAndClient)
    existing.totalViews += post.views || 0
    existing.totalLikes += post.likes || 0
    existing.totalComments += post.comments || 0
    existing.totalShares += post.shares || 0
    if (post.surge_date) {
      existing.dates.push(post.surge_date)
    }

    campaignMap.set(post.client_id, existing)
  })

  return Array.from(campaignMap.entries()).map(([clientId, stats]) => {
    // Find the post with highest views
    const topPost = stats.posts.length > 0
      ? stats.posts.reduce((top, post) => {
          const postViews = post.views || 0
          const topViews = top.views || 0
          return postViews > topViews ? post : top
        }, stats.posts[0])
      : null

    return {
      clientId,
      ...stats,
      postCount: stats.posts.length,
      avgEngagement: stats.posts.length > 0
        ? (stats.totalLikes + stats.totalComments + stats.totalShares) / stats.posts.length
        : 0,
      topPost: topPost ? {
        post_id: topPost.post_id,
        views: topPost.views || 0,
        posted_link: topPost.posted_link || null
      } : null,
      dateRange: stats.dates.length > 0
        ? {
            earliest: new Date(Math.min(...stats.dates.map(d => new Date(d).getTime()))),
            latest: new Date(Math.max(...stats.dates.map(d => new Date(d).getTime())))
          }
        : null
    }
  })
}

export async function getTotalKPIs(startDate?: string, endDate?: string) {
  let query = supabase
    .from('tiktok_posting')
    .select('views, likes, comments, shares, surge_date')

  if (startDate) {
    query = query.gte('surge_date', startDate)
  }
  if (endDate) {
    query = query.lte('surge_date', endDate)
  }

  const { data, error } = await query

  if (error) throw error

  return {
    totalViews: data?.reduce((sum, post) => sum + (post.views || 0), 0) || 0,
    totalLikes: data?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0,
    totalComments: data?.reduce((sum, post) => sum + (post.comments || 0), 0) || 0,
    totalShares: data?.reduce((sum, post) => sum + (post.shares || 0), 0) || 0,
  }
}

export async function getAccountsWithStats() {
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('*')

  if (accountsError) throw accountsError

  const { data: posts, error: postsError } = await supabase
    .from('tiktok_posting')
    .select('account_id, views, likes, comments, shares')

  if (postsError) throw postsError

  const statsMap = new Map<string, {
    post_count: number
    total_views: number
    total_likes: number
    total_comments: number
    total_shares: number
  }>()

  posts?.forEach(post => {
    if (!post.account_id) return
    const existing = statsMap.get(post.account_id) || {
      post_count: 0,
      total_views: 0,
      total_likes: 0,
      total_comments: 0,
      total_shares: 0
    }
    existing.post_count++
    existing.total_views += post.views || 0
    existing.total_likes += post.likes || 0
    existing.total_comments += post.comments || 0
    existing.total_shares += post.shares || 0
    statsMap.set(post.account_id, existing)
  })

  return (accounts as Account[]).map(account => ({
    ...account,
    ...(statsMap.get(account.account_id) || {
      post_count: 0,
      total_views: 0,
      total_likes: 0,
      total_comments: 0,
      total_shares: 0
    })
  })) as AccountWithStats[]
}

export async function getPlatformStats() {
  const { data, error } = await supabase
    .from('accounts')
    .select('platform, followers_count, views_count_total, likes_count_total')

  if (error) throw error

  const platformMap = new Map<string, {
    count: number
    total_followers: number
    total_views: number
    total_likes: number
  }>()

  data?.forEach(account => {
    const existing = platformMap.get(account.platform) || {
      count: 0,
      total_followers: 0,
      total_views: 0,
      total_likes: 0
    }
    existing.count++
    existing.total_followers += account.followers_count || 0
    existing.total_views += account.views_count_total || 0
    existing.total_likes += account.likes_count_total || 0
    platformMap.set(account.platform, existing)
  })

  return Array.from(platformMap.entries()).map(([platform, stats]) => ({
    platform,
    ...stats
  }))
}
