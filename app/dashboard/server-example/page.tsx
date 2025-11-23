import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Force dynamic rendering to avoid build-time errors when env vars aren't set
export const dynamic = 'force-dynamic'

// This is a server component example
export default async function ServerExamplePage() {
  // Only create client if env vars are available
  let supabase = null
  try {
    supabase = createServerClient()
  } catch (error) {
    // Env vars not set - this is expected during development
  }
  
  // Example: Fetch data from Supabase
  // Replace 'your_table' with your actual table name
  // if (supabase) {
  //   const { data, error } = await supabase
  //     .from('your_table')
  //     .select('*')
  //     .limit(10)
  // }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Server Component Example</h1>
        <Card>
          <CardHeader>
            <CardTitle>Server-Side Data Fetching</CardTitle>
            <CardDescription>
              This page uses a server component to fetch data from Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Uncomment the Supabase query above and replace with your table name to fetch data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

