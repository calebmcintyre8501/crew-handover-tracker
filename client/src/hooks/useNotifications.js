import { useEffect, useRef, useState } from 'react'

function useNotifications(currentUserId) {
  const [notifications, setNotifications] = useState([])
  const [toastNotifications, setToastNotifications] =
    useState([])
  const [showNotifications, setShowNotifications] =
    useState(false)

  const knownUpdateIds = useRef([])

  const fetchNotifications = async () => {
    if (!currentUserId) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications?personnel_id=${currentUserId}`
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      setNotifications(data)
    } catch (error) {
      console.error(error)
    }
  }

  const addToast = (notification) => {
    const id = `${Date.now()}-${Math.random()}`

    setToastNotifications((current) => [
      ...current,
      {
        id,
        ...notification,
      },
    ])

    setTimeout(() => {
      setToastNotifications((current) =>
        current.filter(
          (item) => item.id !== id
        )
      )
    }, 8000)
  }

  const dismissToastNotification = (id) => {
    setToastNotifications((current) =>
      current.filter(
        (item) => item.id !== id
      )
    )
  }

  const processNewUpdates = async ({
    updates,
    isAlreadySelected,
    personnel,
  }) => {
    const currentUpdateIds = updates.map(
      (update) => update.id
    )

    if (!isAlreadySelected) {
      knownUpdateIds.current = currentUpdateIds
      return
    }

    if (knownUpdateIds.current.length === 0) {
      knownUpdateIds.current = currentUpdateIds
      return
    }

    const newUpdates = updates.filter(
      (update) =>
        !knownUpdateIds.current.includes(
          update.id
        ) &&
        Number(update.personnel_id) !==
          Number(currentUserId)
    )

    for (const update of newUpdates) {
      const person = personnel.find(
        (item) =>
          Number(item.id) ===
          Number(update.personnel_id)
      )

      const message = person
        ? `${person.rank} ${person.name} added an update.`
        : 'A new update was added.'

      addToast({
        type: 'update',
        title: 'New Handover Update',
        message,
      })
    }

    knownUpdateIds.current = [
      ...new Set([
        ...knownUpdateIds.current,
        ...currentUpdateIds,
      ]),
    ]
  }

  const handleMarkNotificationRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_read: true,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        console.error(data)
        return
      }

      await fetchNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkAllRead = async () => {
    if (!currentUserId) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/personnel/${currentUserId}/read-all`,
        {
          method: 'PATCH',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        console.error(data)
        return
      }

      await fetchNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClearRead = async () => {
    if (!currentUserId) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/personnel/${currentUserId}/read`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        console.error(data)
        return
      }

      await fetchNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const resetUpdateTracking = () => {
    knownUpdateIds.current = []
  }

  const resetNotifications = () => {
    setNotifications([])
    setToastNotifications([])
    setShowNotifications(false)
    knownUpdateIds.current = []
  }

  useEffect(() => {
    fetchNotifications()
  }, [currentUserId])

  return {
    notifications,
    toastNotifications,
    showNotifications,
    setShowNotifications,
    fetchNotifications,
    processNewUpdates,
    dismissToastNotification,
    handleMarkNotificationRead,
    handleMarkAllRead,
    handleClearRead,
    resetUpdateTracking,
    resetNotifications,
  }
}

export default useNotifications