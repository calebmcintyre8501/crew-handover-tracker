import { useEffect, useState } from 'react'

function useSession() {
  const [personnel, setPersonnel] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/personnel')
      .then((response) => response.json())
      .then((data) => setPersonnel(data))
      .catch((error) => console.error(error))

    fetch('http://localhost:8080/api/session/user', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUserId(data.personnel_id)
      })
      .catch((error) => console.error(error))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
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

      if (!response.ok) {
        console.error(data)
        return
      }

      setCurrentUserId(data.personnel_id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeUser = async () => {
    try {
      await fetch(
        'http://localhost:8080/api/session/user',
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
    } catch (error) {
      console.error(error)
    }

    setCurrentUserId(null)
    setSelectedUser('')
  }

  const currentUser = personnel.find(
    (person) => person.id === currentUserId
  )

  return {
    personnel,
    selectedUser,
    setSelectedUser,
    currentUserId,
    currentUser,
    handleSubmit,
    handleChangeUser,
  }
}

export default useSession