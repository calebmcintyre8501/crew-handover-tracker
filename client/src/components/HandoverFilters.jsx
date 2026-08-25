function HandoverFilters({
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  handleClearFilters,
}) {
  return (
    <div className="filter-toolbar">
      <div className="filter-group">
        <label htmlFor="priority-filter">
          Priority
        </label>

        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value)
          }
        >
          <option value="">
            All Priorities
          </option>

          <option value="high">
            High
          </option>

          <option value="normal">
            Normal
          </option>

          <option value="low">
            Low
          </option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">
          Category
        </label>

        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          <option value="mission_issue">
            Mission Issue
          </option>

          <option value="mission_note">
            Mission Note
          </option>

          <option value="system_status">
            System Status
          </option>

          <option value="personnel_note">
            Personnel Note
          </option>

          <option value="training">
            Training
          </option>

          <option value="priority_task">
            Priority Task
          </option>

          <option value="general">
            General
          </option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">
          Status
        </label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="">
            Active Only
          </option>

          <option value="open">
            Open
          </option>

          <option value="in_progress">
            In Progress
          </option>

          <option value="closed">
            Closed
          </option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default HandoverFilters