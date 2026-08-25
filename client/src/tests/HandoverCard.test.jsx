import { render, screen } from '@testing-library/react'
import HandoverCard from '../components/HandoverCard'

describe('HandoverCard', () => {
  test('renders handover information', () => {
    const handover = {
      id: 1,
      title: 'Mission package update',
      description: 'Mission package requires review.',
      category: 'mission_note',
      priority: 'high',
      status: 'open',
      due_date: null,
    }

    render(
      <HandoverCard
        handover={handover}
        handleSelectHandover={() => {}}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: 'Mission package update',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText('mission note')
    ).toBeInTheDocument()

    expect(
      screen.getByText('high')
    ).toBeInTheDocument()

    expect(
      screen.getByText('open')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'View Details',
      })
    ).toBeInTheDocument()
  })
})