import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import AnalyticsPanel from '../components/AnalyticsPanel'

describe('AnalyticsPanel', () => {
  const analytics = {
    handovers: {
      total: 12,
      open: 5,
      in_progress: 3,
      closed: 4,
    },
    priority: {
      high: 3,
      normal: 6,
      low: 3,
    },
    categories: {
      mission_issue: 2,
      mission_note: 3,
      system_status: 2,
      personnel_note: 1,
      training: 1,
      priority_task: 2,
      general: 1,
    },
    updates: 18,
    acknowledgments: 14,
  }

  test('renders analytics summary data', () => {
    render(
      <AnalyticsPanel
        analytics={analytics}
        loading={false}
        handleBack={() => {}}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: 'Handover Analytics',
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText('12')
    ).toBeInTheDocument()

    expect(
      screen.getByText('5')
    ).toBeInTheDocument()

    expect(
      screen.getByText('18')
    ).toBeInTheDocument()

    expect(
      screen.getByText('14')
    ).toBeInTheDocument()
  })

  test('renders priority breakdown', () => {
    render(
      <AnalyticsPanel
        analytics={analytics}
        loading={false}
        handleBack={() => {}}
      />
    )

    expect(
      screen.getByText('High:')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Normal:')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Low:')
    ).toBeInTheDocument()
  })

  test('renders category breakdown', () => {
    render(
      <AnalyticsPanel
        analytics={analytics}
        loading={false}
        handleBack={() => {}}
      />
    )

    expect(
      screen.getByText('mission issue:')
    ).toBeInTheDocument()

    expect(
      screen.getByText('priority task:')
    ).toBeInTheDocument()

    expect(
      screen.getByText('general:')
    ).toBeInTheDocument()
  })

  test('calls handleBack when back button is clicked', () => {
    const handleBack = vi.fn()

    render(
      <AnalyticsPanel
        analytics={analytics}
        loading={false}
        handleBack={handleBack}
      />
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Back to Handovers',
      })
    )

    expect(handleBack).toHaveBeenCalledTimes(1)
  })

  test('shows loading state', () => {
    render(
      <AnalyticsPanel
        analytics={null}
        loading={true}
        handleBack={() => {}}
      />
    )

    expect(
      screen.getByText('Loading analytics...')
    ).toBeInTheDocument()
  })
})