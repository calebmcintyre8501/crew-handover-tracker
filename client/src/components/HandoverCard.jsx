function HandoverCard({
  handover,
  handleSelectHandover,
}) {
  return (
    <article>
      <h3>{handover.title}</h3>

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

      {handover.due_date && (
        <p>
          <strong>Due:</strong>{' '}
          {handover.due_date}
        </p>
      )}

      <p>{handover.description}</p>

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