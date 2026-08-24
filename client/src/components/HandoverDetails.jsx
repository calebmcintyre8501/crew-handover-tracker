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
  handleBack,
}) {
  const creator = personnel.find(
    (person) => person.id === handover.created_by
  )

  const attentionFor = personnel.find(
    (person) => person.id === handover.attention_for
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
        {handover.category}
      </p>

      <p>
        <strong>Priority:</strong>{' '}
        {handover.priority}
      </p>

      <p>
        <strong>Status:</strong>{' '}
        {handover.status}
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
          {handover.due_date}
        </p>
      )}

      <p>{handover.description}</p>

      <div>
        <button
          type="button"
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
            onClick={handleCloseHandover}
          >
            Close Handover
          </button>
        )}
      </div>

      <hr />

      <h3>Update History</h3>

      {updates.length === 0 ? (
        <p>No updates yet.</p>
      ) : (
        updates.map((update) => {
          const person = personnel.find(
            (item) =>
              item.id === update.personnel_id
          )

          return (
            <article key={update.id}>
              <p>
                <strong>
                  {person
                    ? `${person.rank} ${person.name}`
                    : 'Unknown Personnel'}
                </strong>
              </p>

              <p style={{ whiteSpace: 'pre-line' }}>
                {update.message}
              </p>
            </article>
          )
        })
      )}

      <AddUpdateForm
        message={updateMessage}
        setMessage={setUpdateMessage}
        handleAddUpdate={handleAddUpdate}
      />

      <AcknowledgmentList
        acknowledgments={acknowledgments}
        personnel={personnel}
      />
    </section>
  )
}

export default HandoverDetails