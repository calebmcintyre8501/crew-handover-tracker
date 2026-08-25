import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import UserSelect from '../components/UserSelect'

describe('UserSelect', () => {
  const personnel = [
    {
      id: 1,
      name: 'Tia Morgan',
      rank: 'CIV',
      role: 'Cell Lead',
    },
    {
      id: 2,
      name: 'Patrick Martineau',
      rank: 'TSgt',
      role: 'Lead Planner',
    },
    {
      id: 3,
      name: 'Caleb McIntyre',
      rank: 'Sgt',
      role: 'Wideband Planner',
    },
  ]

  test('renders personnel in the dropdown', () => {
    render(
      <UserSelect
        personnel={personnel}
        selectedUser=""
        setSelectedUser={() => {}}
        handleSubmit={() => {}}
      />
    )

    expect(
      screen.getByRole('option', {
        name: 'CIV Tia Morgan - Cell Lead',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', {
        name: 'TSgt Patrick Martineau - Lead Planner',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', {
        name: 'Sgt Caleb McIntyre - Wideband Planner',
      })
    ).toBeInTheDocument()
  })

  test('continue button is disabled when no user is selected', () => {
    render(
      <UserSelect
        personnel={personnel}
        selectedUser=""
        setSelectedUser={() => {}}
        handleSubmit={() => {}}
      />
    )

    expect(
      screen.getByRole('button', {
        name: 'Continue',
      })
    ).toBeDisabled()
  })

  test('calls setSelectedUser when a user is selected', () => {
    const setSelectedUser = vi.fn()

    render(
      <UserSelect
        personnel={personnel}
        selectedUser=""
        setSelectedUser={setSelectedUser}
        handleSubmit={() => {}}
      />
    )

    fireEvent.change(
      screen.getByLabelText('Personnel'),
      {
        target: {
          value: '3',
        },
      }
    )

    expect(
      setSelectedUser
    ).toHaveBeenCalledWith('3')
  })

  test('submits the form when continue is clicked', () => {
    const handleSubmit = vi.fn(
      (event) => event.preventDefault()
    )

    render(
      <UserSelect
        personnel={personnel}
        selectedUser="3"
        setSelectedUser={() => {}}
        handleSubmit={handleSubmit}
      />
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Continue',
      })
    )

    expect(
      handleSubmit
    ).toHaveBeenCalledTimes(1)
  })
})