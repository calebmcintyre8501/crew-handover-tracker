function UserSelect({
  personnel,
  selectedUser,
  setSelectedUser,
  handleSubmit,
}) {
  return (
    <main>
      <h1>Crew Handover Tracker</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="user-select">
          Select your user
        </label>

        <select
          id="user-select"
          value={selectedUser}
          onChange={(event) =>
            setSelectedUser(event.target.value)
          }
        >
          <option value="">
            Select personnel
          </option>

          {personnel.map((person) => (
            <option
              key={person.id}
              value={person.id}
            >
              {person.rank} {person.name} - {person.role}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!selectedUser}
        >
          Continue
        </button>
      </form>
    </main>
  )
}

export default UserSelect