import { useEffect, useState } from 'react'

function useAnalytics(enabled) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAnalytics = async () => {
    if (!enabled) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/analytics'
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      setAnalytics(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [enabled])

  return {
    analytics,
    loading,
    fetchAnalytics,
  }
}

export default useAnalytics