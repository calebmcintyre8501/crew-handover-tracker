import CreateHandoverForm from './CreateHandoverForm'
import HandoverFilters from './HandoverFilters'
import HandoverList from './HandoverList'

function Dashboard({
  personnel,
  handovers,
  showCreateForm,
  setShowCreateForm,
  newHandover,
  handleNewHandoverChange,
  handleCreateHandover,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  handleClearFilters,
  handleSelectHandover,
  handleShowAnalytics,
}) {
  return (
    <section>
      <div>
        <h2>Active Handovers</h2>

        <div className="dashboard-actions">
          <button
            type="button"
            onClick={handleShowAnalytics}
          >
            Analytics
          </button>

          <button
            type="button"
            onClick={() =>
              setShowCreateForm(
                (current) => !current
              )
            }
          >
            {showCreateForm
              ? 'Cancel'
              : 'Create Handover'}
          </button>
        </div>
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
        handleClearFilters={
          handleClearFilters
        }
      />

      <HandoverList
        handovers={handovers}
        handleSelectHandover={
          handleSelectHandover
        }
      />
    </section>
  )
}

export default Dashboard