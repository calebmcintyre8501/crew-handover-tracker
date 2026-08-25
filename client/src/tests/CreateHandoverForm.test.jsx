import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import CreateHandoverForm from '../components/CreateHandoverForm'

describe('CreateHandoverForm', () => {
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
  ]

  const newHandover = {
    title: '',
    description: '',
    category: '',
    priority: 'normal',
    status: 'open',
    attention_for: '',
    due_date: '',
  }

  test('renders the handover form fields', () => {
    render(
      <CreateHandoverForm
        newHandover={newHandover}
        personnel={personnel}
        handleNewHandoverChange={() => {}}
        handleCreateHandover={() => {}}
      />
    )

    expect(
      screen.getByLabelText('Title')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Description')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Category')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Priority')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Status')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Attention For')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Due Date')
    ).toBeInTheDocument()
  })

  test('renders personnel in the attention dropdown', () => {
    render(
      <CreateHandoverForm
        newHandover={newHandover}
        personnel={personnel}
        handleNewHandoverChange={() => {}}
        handleCreateHandover={() => {}}
      />
    )

    expect(
      screen.getByRole('option', {
        name: 'CIV Tia Morgan',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', {
        name: 'TSgt Patrick Martineau',
      })
    ).toBeInTheDocument()
  })

  test('calls change handler when title changes', () => {
    const handleNewHandoverChange = vi.fn()

    render(
      <CreateHandoverForm
        newHandover={newHandover}
        personnel={personnel}
        handleNewHandoverChange={handleNewHandoverChange}
        handleCreateHandover={() => {}}
      />
    )

    fireEvent.change(
      screen.getByLabelText('Title'),
      {
        target: {
          value: 'New handover',
        },
      }
    )

    expect(
      handleNewHandoverChange
    ).toHaveBeenCalled()
  })

  test('submits the form', () => {
    const handleCreateHandover = vi.fn(
      (event) => event.preventDefault()
    )

    render(
      <CreateHandoverForm
        newHandover={{
          ...newHandover,
          title: 'Mission note',
          description: 'Test description',
          category: 'mission_note',
        }}
        personnel={personnel}
        handleNewHandoverChange={() => {}}
        handleCreateHandover={handleCreateHandover}
      />
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Save Handover',
      })
    )

    expect(
      handleCreateHandover
    ).toHaveBeenCalledTimes(1)
  })
})