function CreateHandoverForm({
  newHandover,
  personnel,
  handleNewHandoverChange,
  handleCreateHandover,
}) {
  return (
    <form onSubmit={handleCreateHandover}>
      <h3>New Handover</h3>

      <div>
        <label htmlFor="title">
          Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={newHandover.title}
          onChange={handleNewHandoverChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={newHandover.description}
          onChange={handleNewHandoverChange}
          required
        />
      </div>

      <div>
        <label htmlFor="category">
          Category
        </label>

        <select
          id="category"
          name="category"
          value={newHandover.category}
          onChange={handleNewHandoverChange}
          required
        >
          <option value="">
            Select Category
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

      <div>
        <label htmlFor="priority">
          Priority
        </label>

        <select
          id="priority"
          name="priority"
          value={newHandover.priority}
          onChange={handleNewHandoverChange}
        >
          <option value="low">
            Low
          </option>

          <option value="normal">
            Normal
          </option>

          <option value="high">
            High
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="status">
          Status
        </label>

        <select
          id="status"
          name="status"
          value={newHandover.status}
          onChange={handleNewHandoverChange}
        >
          <option value="open">
            Open
          </option>

          <option value="in_progress">
            In Progress
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="attention_for">
          Attention For
        </label>

        <select
          id="attention_for"
          name="attention_for"
          value={newHandover.attention_for}
          onChange={handleNewHandoverChange}
        >
          <option value="">
            Everyone
          </option>

          {personnel.map((person) => (
            <option
              key={person.id}
              value={person.id}
            >
              {person.rank} {person.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="due_date">
          Due Date
        </label>

        <input
          id="due_date"
          name="due_date"
          type="date"
          value={newHandover.due_date}
          onChange={handleNewHandoverChange}
        />
      </div>

      <button type="submit">
        Save Handover
      </button>
    </form>
  )
}

export default CreateHandoverForm