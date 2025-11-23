"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export function useSupabaseData<T>(table: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const { data: fetchedData, error: fetchError } = await supabase
          .from(table)
          .select("*")

        if (fetchError) throw fetchError
        setData(fetchedData as T[])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table])

  return { data, loading, error }
}

