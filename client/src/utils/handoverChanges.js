function getPersonName(personnel, id) {
  const person = personnel.find(
    (item) => Number(item.id) === Number(id)
  )

  if (!person) {
    return 'Everyone'
  }

  return `${person.rank} ${person.name}`
}

function getHandoverChanges({
  original,
  edited,
  personnel,
}) {
  const changes = []

  if (original.title !== edited.title) {
    changes.push(
      `Title: "${original.title}" → "${edited.title}"`
    )
  }

  if (original.description !== edited.description) {
    changes.push('Description updated')
  }

  if (original.category !== edited.category) {
    changes.push(
      `Category: ${original.category} → ${edited.category}`
    )
  }

  if (original.priority !== edited.priority) {
    changes.push(
      `Priority: ${original.priority} → ${edited.priority}`
    )
  }

  if (original.status !== edited.status) {
    changes.push(
      `Status: ${original.status} → ${edited.status}`
    )
  }

  const oldAttention = original.attention_for || ''
  const newAttention = edited.attention_for || ''

  if (String(oldAttention) !== String(newAttention)) {
    changes.push(
      `Attention For: ${getPersonName(
        personnel,
        oldAttention
      )} → ${getPersonName(personnel, newAttention)}`
    )
  }

  const oldDueDate = original.due_date
    ? original.due_date.slice(0, 10)
    : ''

  const newDueDate = edited.due_date || ''

  if (oldDueDate !== newDueDate) {
    changes.push(
      `Due Date: ${oldDueDate || 'None'} → ${
        newDueDate || 'None'
      }`
    )
  }

  return changes
}

export default getHandoverChanges