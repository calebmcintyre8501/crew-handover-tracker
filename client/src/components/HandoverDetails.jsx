import AddUpdateForm from './AddUpdateForm'
import AcknowledgmentList from './AcknowledgmentList'

function HandoverDetails({
  handover,
  updates,
  acknowledgments,
  personnel,
  updateMessage,
  setUpdateMessage,
  handleAddUpdate,
  handleAcknowledge,
  handleCloseHandover,
  handleEditHandover,
  handleDeleteHandover,
  handleBack,
}) {
  const creator = personnel.find(
    (person) =>
      person.id === handover.created_by
  )

  const attentionFor = personnel.find(
    (person) =>
      person.id === handover.attention_for
  )

  return (
    <section>
      <button
        type="button"
        onClick={handleBack}
      >
        Back to Handovers
      </button>

      <h2>{handover.title}</h2>

      <p>
        <strong>Category:</strong>{' '}
        <span
          className={`badge category ${handover.category}`}
        >
          {handover.category.replaceAll('_', ' ')}
        </span>
      </p>

      <p>
        <strong>Priority:</strong>{' '}
        <span
          className={`badge priority ${handover.priority}`}
        >
          {handover.priority}
        </span>
      </p>

      <p>
        <strong>Status:</strong>{' '}
        <span
          className={`badge status ${handover.status}`}
        >
          {handover.status.replaceAll('_', ' ')}
        </span>
      </p>

      <p>
        <strong>Created By:</strong>{' '}
        {creator
          ? `${creator.rank} ${creator.name}`
          : 'Unknown'}
      </p>

      <p>
        <strong>Attention For:</strong>{' '}
        {attentionFor
          ? `${attentionFor.rank} ${attentionFor.name}`
          : 'Everyone'}
      </p>

      {handover.due_date && (
        <p>
          <strong>Due Date:</strong>{' '}
          {handover.due_date.slice(0, 10)}
        </p>
      )}

      <p>{handover.description}</p>

      <div className="handover-actions">
        <button
          type="button"
          className="action-primary"
          onClick={handleAcknowledge}
        >
          Acknowledge
        </button>

        <button
          type="button"
          onClick={handleEditHandover}
        >
          Edit Handover
        </button>

        {handover.status !== 'closed' && (
          <button
            type="button"
            className="action-warning"
            onClick={handleCloseHandover}
          >
            Close Handover
          </button>
        )}

        <button
          type="button"
          className="action-danger"
          onClick={handleDeleteHandover}
        >
          Delete Handover
        </button>
      </div>

      <hr />

      <div className="history-section">
        <h3>Update History</h3>

        {updates.length === 0 ? (
          <p className="empty-message">
            No updates yet.
          </p>
        ) : (
          <div className="history-list">
            {updates.map((update) => {
              const person = personnel.find(
                (item) =>
                  item.id === update.personnel_id
              )

              return (
                <article
                  className="history-entry"
                  key={update.id}
                >
                  <div className="history-author">
                    {person
                      ? `${person.rank} ${person.name}`
                      : 'Unknown Personnel'}
                  </div>

                  <div className="history-message">
                    {update.message}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <AddUpdateForm
        message={updateMessage}
        setMessage={setUpdateMessage}
        handleAddUpdate={handleAddUpdate}
      />

      <div className="acknowledgment-section">
        <AcknowledgmentList
          acknowledgments={acknowledgments}
          personnel={personnel}
        />
      </div>
    </section>
  )
}

export default HandoverDetails