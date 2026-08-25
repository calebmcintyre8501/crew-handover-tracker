function UserSelect({
  personnel,
  selectedUser,
  setSelectedUser,
  handleSubmit,
}) {
  return (
    <main className="login-screen">
      <section className="login-panel">
        <p className="app-eyebrow">
          Operations Handover
        </p>

        <h1>Crew Handover Tracker</h1>

        <p className="login-description">
          Select your personnel profile to access the current crew handover.
        </p>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="user-select">
              Personnel
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
          </div>

          <button
            type="submit"
            className="action-primary"
            disabled={!selectedUser}
          >
            Continue
          </button>
        </form>
      </section>
    </main>
  )
}

export default UserSelect