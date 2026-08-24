function Header({
  currentUser,
  handleChangeUser,
}) {
  return (
    <header>
      <div>
        <h1>Crew Handover Tracker</h1>

        <p>
          {currentUser.rank} {currentUser.name}
        </p>

        <p>{currentUser.role}</p>
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