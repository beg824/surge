import { NextResponse } from 'next/server'
import { getAllClients } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const clients = await getAllClients()
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

