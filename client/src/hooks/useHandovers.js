import { useEffect, useState } from 'react'

const emptyHandover = {
  title: '',
  description: '',
  category: '',
  priority: 'normal',
  status: 'open',
  attention_for: '',
  due_date: '',
}

function useHandovers({
  currentUserId,
}) {
  const [handovers, setHandovers] = useState([])
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newHandover, setNewHandover] =
    useState(emptyHandover)

  const fetchHandovers = async () => {
    if (!currentUserId) {
      return
    }

    const params = new URLSearchParams()

    if (priorityFilter) {
      params.append(
        'priority',
        priorityFilter
      )
    }

    if (categoryFilter) {
      params.append(
        'category',
        categoryFilter
      )
    }

    if (statusFilter) {
      params.append(
        'status',
        statusFilter
      )
    }

    const queryString = params.toString()

    const url = queryString
      ? `http://localhost:8080/api/handovers?${queryString}`
      : 'http://localhost:8080/api/handovers'

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      setHandovers(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchHandovers()
  }, [
    currentUserId,
    priorityFilter,
    categoryFilter,
    statusFilter,
  ])

  const handleNewHandoverChange = (event) => {
    const { name, value } = event.target

    setNewHandover((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleCreateHandover = async (event) => {
    event.preventDefault()

    const handoverData = {
      ...newHandover,
      created_by: currentUserId,
      attention_for:
        newHandover.attention_for
          ? Number(
              newHandover.attention_for
            )
          : null,
      due_date:
        newHandover.due_date || null,
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/handovers',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            handoverData
          ),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      setNewHandover(emptyHandover)
      setShowCreateForm(false)

      await fetchHandovers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClearFilters = () => {
    setPriorityFilter('')
    setCategoryFilter('')
    setStatusFilter('')
  }

  const resetHandovers = () => {
    setHandovers([])
    setPriorityFilter('')
    setCategoryFilter('')
    setStatusFilter('')
    setShowCreateForm(false)
    setNewHandover(emptyHandover)
  }

  return {
    handovers,

    priorityFilter,
    setPriorityFilter,

    categoryFilter,
    setCategoryFilter,

    statusFilter,
    setStatusFilter,

    showCreateForm,
    setShowCreateForm,

    newHandover,

    fetchHandovers,
    handleNewHandoverChange,
    handleCreateHandover,
    handleClearFilters,
    resetHandovers,
  }
}

export default useHandovers