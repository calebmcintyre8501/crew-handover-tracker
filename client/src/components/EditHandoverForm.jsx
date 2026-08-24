function EditHandoverForm({
  editHandover,
  personnel,
  handleEditChange,
  handleSaveEdit,
  handleCancelEdit,
}) {
  return (
    <form onSubmit={handleSaveEdit}>
      <h3>Edit Handover</h3>

      <div>
        <label htmlFor="edit-title">Title</label>
        <input
          id="edit-title"
          name="title"
          value={editHandover.title}
          onChange={handleEditChange}
          required
        />
      </div>

      <div>
        <label htmlFor="edit-description">Description</label>
        <textarea
          id="edit-description"
          name="description"
          value={editHandover.description}
          onChange={handleEditChange}
          required
        />
      </div>

      <div>
        <label htmlFor="edit-category">Category</label>
        <select
          id="edit-category"
          name="category"
          value={editHandover.category}
          onChange={handleEditChange}
          required
        >
          <option value="mission_issue">Mission Issue</option>
          <option value="mission_note">Mission Note</option>
          <option value="system_status">System Status</option>
          <option value="personnel_note">Personnel Note</option>
          <option value="training">Training</option>
          <option value="priority_task">Priority Task</option>
          <option value="general">General</option>
        </select>
      </div>

      <div>
        <label htmlFor="edit-priority">Priority</label>
        <select
          id="edit-priority"
          name="priority"
          value={editHandover.priority}
          onChange={handleEditChange}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="edit-status">Status</label>
        <select
          id="edit-status"
          name="status"
          value={editHandover.status}
          onChange={handleEditChange}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label htmlFor="edit-attention">Attention For</label>
        <select
          id="edit-attention"
          name="attention_for"
          value={editHandover.attention_for || ''}
          onChange={handleEditChange}
        >
          <option value="">Everyone</option>

          {personnel.map((person) => (
            <option key={person.id} value={person.id}>
              {person.rank} {person.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="edit-due-date">Due Date</label>
        <input
          id="edit-due-date"
          name="due_date"
          type="date"
          value={
            editHandover.due_date
              ? editHandover.due_date.slice(0, 10)
              : ''
          }
          onChange={handleEditChange}
        />
      </div>

      <button type="submit">Save Changes</button>

      <button
        type="button"
        onClick={handleCancelEdit}
      >
        Cancel
      </button>
    </form>
  )
}

export default EditHandoverForm