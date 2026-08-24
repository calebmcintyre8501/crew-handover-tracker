import HandoverCard from './HandoverCard'

function HandoverList({
  handovers,
  handleSelectHandover,
}) {
  return (
    <>
      <p>
        {handovers.length} handover
        {handovers.length === 1 ? '' : 's'} shown
      </p>

      {handovers.length === 0 ? (
        <p>
          No handovers match the selected filters.
        </p>
      ) : (
        <div>
          {handovers.map((handover) => (
            <HandoverCard
              key={handover.id}
              handover={handover}
              handleSelectHandover={
                handleSelectHandover
              }
            />
          ))}
        </div>
      )}
    </>
  )
}

export default HandoverList