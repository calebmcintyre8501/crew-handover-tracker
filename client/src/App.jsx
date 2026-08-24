import { useEffect, useState } from 'react'
import './App.css'

import UserSelect from './components/UserSelect'
import Header from './components/Header'
import HandoverFilters from './components/HandoverFilters'
import HandoverList from './components/HandoverList'
import CreateHandoverForm from './components/CreateHandoverForm'
import HandoverDetails from './components/HandoverDetails'
import EditHandoverForm from './components/EditHandoverForm'

function App() {
  const [personnel, setPersonnel] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)

  const [handovers, setHandovers] = useState([])

  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [showCreateForm, setShowCreateForm] = useState(false)

  const [newHandover, setNewHandover] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'normal',
    status: 'open',
    attention_for: '',
    due_date: '',
  })

  const [selectedHandover, setSelectedHandover] = useState(null)
  const [updates, setUpdates] = useState([])
  const [acknowledgments, setAcknowledgments] = useState([])
  const [updateMessage, setUpdateMessage] = useState('')

  const [isEditing, setIsEditing] = useState(false)

  const [editHandover, setEditHandover] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    status: '',
    attention_for: '',
    due_date: '',
  })

  useEffect(() => {
    fetch('http://localhost:8080/api/personnel')
      .then((response) => response.json())
      .then((data) => setPersonnel(data))
      .catch((error) => console.error(error))

    fetch('http://localhost:8080/api/session/user', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => setCurrentUserId(data.personnel_id))
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    if (!currentUserId) {
      return
    }

    fetchHandovers()
  }, [
    currentUserId,
    priorityFilter,
    categoryFilter,
    statusFilter,
  ])

  const fetchHandovers = async () => {
    const params = new URLSearchParams()

    if (priorityFilter) {
      params.append('priority', priorityFilter)
    }

    if (categoryFilter) {
      params.append('category', categoryFilter)
    }

    if (statusFilter) {
      params.append('status', statusFilter)
    }

    const queryString = params.toString()

    const url = queryString
      ? `http://localhost:8080/api/handovers?${queryString}`
      : 'http://localhost:8080/api/handovers'

    try {
      const response = await fetch(url)
      const data = await response.json()

      setHandovers(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const response = await fetch(
      'http://localhost:8080/api/session/user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          personnel_id: Number(selectedUser),
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      setCurrentUserId(data.personnel_id)
    }
  }

  const handleChangeUser = async () => {
    await fetch(
      'http://localhost:8080/api/session/user',
      {
        method: 'DELETE',
        credentials: 'include',
      }
    )

    setCurrentUserId(null)
    setSelectedUser('')
    setHandovers([])
    setPriorityFilter('')
    setCategoryFilter('')
    setStatusFilter('')
    setSelectedHandover(null)
    setUpdates([])
    setAcknowledgments([])
    setUpdateMessage('')
    setIsEditing(false)
  }

  const handleClearFilters = () => {
    setPriorityFilter('')
    setCategoryFilter('')
    setStatusFilter('')
  }

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
      title: newHandover.title,
      description: newHandover.description,
      category: newHandover.category,
      priority: newHandover.priority,
      status: newHandover.status,
      created_by: currentUserId,
      attention_for: newHandover.attention_for
        ? Number(newHandover.attention_for)
        : null,
      due_date: newHandover.due_date || null,
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/handovers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(handoverData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      setNewHandover({
        title: '',
        description: '',
        category: '',
        priority: 'normal',
        status: 'open',
        attention_for: '',
        due_date: '',
      })

      setShowCreateForm(false)

      await fetchHandovers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectHandover = async (id) => {
    try {
      const handoverResponse = await fetch(
        `http://localhost:8080/api/handovers/${id}`
      )

      const updatesResponse = await fetch(
        `http://localhost:8080/api/handovers/${id}/updates`
      )

      const acknowledgmentResponse = await fetch(
        'http://localhost:8080/api/acknowledgments'
      )

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

      setSelectedHandover(handoverData)
      setUpdates(updatesData)

      setAcknowledgments(
        acknowledgmentData.filter(
          (acknowledgment) =>
            acknowledgment.handover_id === id
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddUpdate = async (event) => {
    event.preventDefault()

    if (!updateMessage.trim()) {
      return
    }

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

      await handleSelectHandover(
        selectedHandover.id
      )
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
        await handleSelectHandover(
          selectedHandover.id
        )

        return
      }

      const data = await response.json()
      console.error(data)
    } catch (error) {
      console.error(error)
    }
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

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      setSelectedHandover(null)
      setUpdates([])
      setAcknowledgments([])

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
      due_date:
        selectedHandover.due_date || '',
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

    const changes = []

    if (selectedHandover.title !== editHandover.title) {
      changes.push(
        `Title: "${selectedHandover.title}" → "${editHandover.title}"`
      )
    }

    if (
      selectedHandover.description !==
      editHandover.description
    ) {
      changes.push('Description updated')
    }

    if (
      selectedHandover.category !==
      editHandover.category
    ) {
      changes.push(
        `Category: ${selectedHandover.category} → ${editHandover.category}`
      )
    }

    if (
      selectedHandover.priority !==
      editHandover.priority
    ) {
      changes.push(
        `Priority: ${selectedHandover.priority} → ${editHandover.priority}`
      )
    }

    if (
      selectedHandover.status !==
      editHandover.status
    ) {
      changes.push(
        `Status: ${selectedHandover.status} → ${editHandover.status}`
      )
    }

    const oldAttention =
      selectedHandover.attention_for || ''

    const newAttention =
      editHandover.attention_for || ''

    if (
      String(oldAttention) !==
      String(newAttention)
    ) {
      const oldPerson = personnel.find(
        (person) =>
          person.id === Number(oldAttention)
      )

      const newPerson = personnel.find(
        (person) =>
          person.id === Number(newAttention)
      )

      changes.push(
        `Attention For: ${
          oldPerson
            ? `${oldPerson.rank} ${oldPerson.name}`
            : 'Everyone'
        } → ${
          newPerson
            ? `${newPerson.rank} ${newPerson.name}`
            : 'Everyone'
        }`
      )
    }

    const oldDueDate = selectedHandover.due_date
      ? selectedHandover.due_date.slice(0, 10)
      : ''

    const newDueDate =
      editHandover.due_date || ''

    if (oldDueDate !== newDueDate) {
      changes.push(
        `Due Date: ${oldDueDate || 'None'} → ${
          newDueDate || 'None'
        }`
      )
    }

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
            due_date:
              editHandover.due_date || null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        return
      }

      if (changes.length > 0) {
        const updateResponse = await fetch(
          'http://localhost:8080/api/updates',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              handover_id: selectedHandover.id,
              personnel_id: currentUserId,
              message:
                `Edited handover:\n${changes.join('\n')}`,
            }),
          }
        )

        if (!updateResponse.ok) {
          const updateData =
            await updateResponse.json()

          console.error(updateData)
        }
      }

      setIsEditing(false)

      await handleSelectHandover(
        selectedHandover.id
      )

      await fetchHandovers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleBack = () => {
    setSelectedHandover(null)
    setUpdates([])
    setAcknowledgments([])
    setUpdateMessage('')
    setIsEditing(false)
  }

  const currentUser = personnel.find(
    (person) => person.id === currentUserId
  )

  if (!currentUser) {
    return (
      <UserSelect
        personnel={personnel}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleSubmit={handleSubmit}
      />
    )
  }

  if (selectedHandover) {
    return (
      <main>
        <Header
          currentUser={currentUser}
          handleChangeUser={handleChangeUser}
        />

        {isEditing ? (
          <EditHandoverForm
            editHandover={editHandover}
            personnel={personnel}
            handleEditChange={handleEditChange}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
          />
        ) : (
          <HandoverDetails
            handover={selectedHandover}
            updates={updates}
            acknowledgments={acknowledgments}
            personnel={personnel}
            updateMessage={updateMessage}
            setUpdateMessage={setUpdateMessage}
            handleAddUpdate={handleAddUpdate}
            handleAcknowledge={handleAcknowledge}
            handleCloseHandover={
              handleCloseHandover
            }
            handleEditHandover={
              handleEditHandover
            }
            handleBack={handleBack}
          />
        )}
      </main>
    )
  }

  return (
    <main>
      <Header
        currentUser={currentUser}
        handleChangeUser={handleChangeUser}
      />

      <section>
        <div>
          <h2>Active Handovers</h2>

          <button
            type="button"
            onClick={() =>
              setShowCreateForm((current) => !current)
            }
          >
            {showCreateForm
              ? 'Cancel'
              : 'Create Handover'}
          </button>
        </div>

        {showCreateForm && (
          <CreateHandoverForm
            newHandover={newHandover}
            personnel={personnel}
            handleNewHandoverChange={
              handleNewHandoverChange
            }
            handleCreateHandover={
              handleCreateHandover
            }
          />
        )}

        <HandoverFilters
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleClearFilters={handleClearFilters}
        />

        <HandoverList
          handovers={handovers}
          handleSelectHandover={
            handleSelectHandover
          }
        />
      </section>
    </main>
  )
}

export default App