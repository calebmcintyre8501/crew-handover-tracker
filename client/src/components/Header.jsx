function Header({
  currentUser,
  handleChangeUser,
}) {
  return (
    <header className="app-header">
      <div>
        <p className="app-eyebrow">
          Operations Handover
        </p>

        <h1>Crew Handover Tracker</h1>

        <div className="current-user">
          <span className="current-user-name">
            {currentUser.rank} {currentUser.name}
          </span>

          <span className="current-user-role">
            {currentUser.role}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleChangeUser}
      >
        Change User
      </button>
    </header>
  )
}

export default Header