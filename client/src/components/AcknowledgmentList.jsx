function AcknowledgmentList({
  acknowledgments,
  personnel,
}) {
  if (acknowledgments.length === 0) {
    return <p>No acknowledgments yet.</p>
  }

  return (
    <div>
      <h3>Acknowledged By</h3>

      {acknowledgments.map((acknowledgment) => {
        const person = personnel.find(
          (item) =>
            item.id === acknowledgment.personnel_id
        )

        return (
          <p key={acknowledgment.id}>
            {person
              ? `${person.rank} ${person.name}`
              : 'Unknown Personnel'}
          </p>
        )
      })}
    </div>
  )
}

export default AcknowledgmentList