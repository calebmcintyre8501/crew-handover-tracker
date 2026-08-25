function HandoverCard({
  handover,
  handleSelectHandover,
}) {
  return (
    <article
      className={`handover-card priority-${handover.priority}`}
    >
      <h3>{handover.title}</h3>

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

      {handover.due_date && (
        <p>
          <strong>Due Date:</strong>{' '}
          {handover.due_date}
        </p>
      )}

      <button
        type="button"
        onClick={() =>
          handleSelectHandover(handover.id)
        }
      >
        View Details
      </button>
    </article>
  )
}

export default HandoverCard