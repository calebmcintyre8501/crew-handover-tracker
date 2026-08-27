import { useState } from 'react'
import getHandoverChanges from '../utils/handoverChanges'

function useHandoverDetails({
  currentUserId,
  personnel,
  fetchHandovers,
  processNewUpdates,
  resetUpdateTracking,
}) {
  const [selectedHandover, setSelectedHandover] =
    useState(null)
  const [updates, setUpdates] = useState([])
  const [acknowledgments, setAcknowledgments] =
    useState([])
  const [updateMessage, setUpdateMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editHandover, setEditHandover] = useState({})

  const handleSelectHandover = async (id) => {
    try {
      const [
        handoverResponse,
        updatesResponse,
        acknowledgmentResponse,
      ] = await Promise.all([
        fetch(`http://localhost:8080/api/handovers/${id}`),
        fetch(
          `http://localhost:8080/api/handovers/${id}/updates`
        ),
        fetch(
          'http://localhost:8080/api/acknowledgments'
        ),
      ])

      const handoverData = await handoverResponse.json()
      const updatesData = await updatesResponse.json()
      const acknowledgmentData =
        await acknowledgmentResponse.json()

      if (!handoverResponse.ok) {
        console.error(handoverData)
        return
      }

      if (!updatesResponse.ok) {
        console.error(updatesData)
        return
      }

      if (!acknowledgmentResponse.ok) {
        console.error(acknowledgmentData)
        return
      }

      await processNewUpdates({
        updates: updatesData,
        handoverId: Number(id),
        isAlreadySelected:
          Number(selectedHandover?.id) === Number(id),
        personnel,
      })

      setSelectedHandover(handoverData)
      setUpdates(updatesData)

      setAcknowledgments(
        acknowledgmentData.filter(
          (acknowledgment) =>
            Number(acknowledgment.handover_id) ===
            Number(id)
        )
      )

      setIsEditing(false)
    } catch (error) {
      console.error('View details failed:', error)
    }
  }

  const handleAddUpdate = async (event) => {
    event.preventDefault()

    if (!updateMessage.trim()) return

    try {
      const response = await fetch(
        'http://localhost:8080/api/updates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            handover_id: selectedHandover.id,
            personnel_id: currentUserId,
            message: updateMessage,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      setUpdateMessage('')
      await handleSelectHandover(selectedHandover.id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAcknowledge = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/acknowledgments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            handover_id: selectedHandover.id,
            personnel_id: currentUserId,
          }),
        }
      )

      if (response.ok || response.status === 409) {
        await handleSelectHandover(selectedHandover.id)
        return
      }

      console.error(await response.json())
    } catch (error) {
      console.error(error)
    }
  }

  const leaveDetails = () => {
    setSelectedHandover(null)
    setUpdates([])
    setAcknowledgments([])
    setUpdateMessage('')
    setIsEditing(false)
    resetUpdateTracking()
  }

  const handleCloseHandover = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/handovers/${selectedHandover.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'closed',
          }),
        }
      )

      if (!response.ok) {
        console.error(await response.json())
        return
      }

      leaveDetails()
      await fetchHandovers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteHandover = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this handover?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `http://localhost:8080/api/handovers/${selectedHandover.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        console.error(await response.json())
        return
      }

      leaveDetails()
      await fetchHandovers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditHandover = () => {
    setEditHandover({
      title: selectedHandover.title,
      description: selectedHandover.description,
      category: selectedHandover.category,
      priority: selectedHandover.priority,
      status: selectedHandover.status,
      attention_for:
        selectedHandover.attention_for || '',
      due_date: selectedHandover.due_date
        ? selectedHandover.due_date.slice(0, 10)
        : '',
    })

    setIsEditing(true)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target

    setEditHandover((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSaveEdit = async (event) => {
    event.preventDefault()

    const changes = getHandoverChanges({
      original: selectedHandover,
      edited: editHandover,
      personnel,
    })

    try {
      const response = await fetch(
        `http://localhost:8080/api/handovers/${selectedHandover.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...editHandover,
            attention_for: editHandover.attention_for
              ? Number(editHandover.attention_for)
              : null,
            due_date: editHandover.due_date || null,
          }),
        }
      )

      if (!response.ok) {
        console.error(await response.json())
        return
      }

      if (changes.length > 0) {
        await fetch(
          'http://localhost:8080/api/updates',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              handover_id: selectedHandover.id,
              personnel_id: currentUserId,
              message: `Edited handover:\n${changes.join(
                '\n'
              )}`,
            }),
          }
        )
      }

      setIsEditing(false)

      await handleSelectHandover(selectedHandover.id)
      await fetchHandovers()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    selectedHandover,
    updates,
    acknowledgments,
    updateMessage,
    setUpdateMessage,
    isEditing,
    editHandover,
    handleSelectHandover,
    handleAddUpdate,
    handleAcknowledge,
    handleCloseHandover,
    handleDeleteHandover,
    handleEditHandover,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit: () => setIsEditing(false),
    handleBack: leaveDetails,
  }
}

export default useHandoverDetails