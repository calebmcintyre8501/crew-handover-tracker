import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import HandoverFilters from '../components/HandoverFilters'

describe('HandoverFilters', () => {
  const defaultProps = {
    priorityFilter: '',
    setPriorityFilter: vi.fn(),
    categoryFilter: '',
    setCategoryFilter: vi.fn(),
    statusFilter: '',
    setStatusFilter: vi.fn(),
    handleClearFilters: vi.fn(),
  }

  test('renders the filter controls', () => {
    render(
      <HandoverFilters {...defaultProps} />
    )

    expect(
      screen.getByLabelText('Priority')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Category')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Status')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Clear Filters',
      })
    ).toBeInTheDocument()
  })

  test('changes the priority filter', () => {
    const setPriorityFilter = vi.fn()

    render(
      <HandoverFilters
        {...defaultProps}
        setPriorityFilter={setPriorityFilter}
      />
    )

    fireEvent.change(
      screen.getByLabelText('Priority'),
      {
        target: {
          value: 'high',
        },
      }
    )

    expect(
      setPriorityFilter
    ).toHaveBeenCalledWith('high')
  })

  test('changes the category filter', () => {
    const setCategoryFilter = vi.fn()

    render(
      <HandoverFilters
        {...defaultProps}
        setCategoryFilter={setCategoryFilter}
      />
    )

    const categorySelect =
      screen.getByLabelText('Category')

    const categoryOption = Array.from(
      categorySelect.options
    ).find((option) => option.value)

    fireEvent.change(categorySelect, {
      target: {
        value: categoryOption.value,
      },
    })

    expect(
      setCategoryFilter
    ).toHaveBeenCalledWith(
      categoryOption.value
    )
  })

  test('changes the status filter', () => {
    const setStatusFilter = vi.fn()

    render(
      <HandoverFilters
        {...defaultProps}
        setStatusFilter={setStatusFilter}
      />
    )

    fireEvent.change(
      screen.getByLabelText('Status'),
      {
        target: {
          value: 'closed',
        },
      }
    )

    expect(
      setStatusFilter
    ).toHaveBeenCalledWith('closed')
  })

  test('clears the filters', () => {
    const handleClearFilters = vi.fn()

    render(
      <HandoverFilters
        {...defaultProps}
        handleClearFilters={
          handleClearFilters
        }
      />
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear Filters',
      })
    )

    expect(
      handleClearFilters
    ).toHaveBeenCalledTimes(1)
  })
})