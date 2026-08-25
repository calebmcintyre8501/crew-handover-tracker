import { render, screen } from '@testing-library/react'
import HandoverList from '../components/HandoverList'

describe('HandoverList', () => {
  test('renders multiple handovers', () => {
    const handovers = [
      {
        id: 1,
        title: 'Mission package update',
        description: 'Mission package requires review.',
        category: 'mission_note',
        priority: 'high',
        status: 'open',
      },
      {
        id: 2,
        title: 'Equipment status',
        description: 'Verify equipment status.',
        category: 'equipment',
        priority: 'normal',
        status: 'in_progress',
      },
    ]

    render(
      <HandoverList
        handovers={handovers}
        handleSelectHandover={() => {}}
      />
    )

    expect(
      screen.getByText('Mission package update')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Equipment status')
    ).toBeInTheDocument()
  })

  test('renders a message when there are no handovers', () => {
    render(
      <HandoverList
        handovers={[]}
        handleSelectHandover={() => {}}
      />
    )

    expect(
      screen.getByText(/no handovers/i)
    ).toBeInTheDocument()
  })
})