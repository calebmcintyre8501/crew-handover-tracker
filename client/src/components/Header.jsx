import NotificationBell from './NotificationBell'

function Header({
  currentUser,
  handleChangeUser,
  notifications,
  showNotifications,
  setShowNotifications,
  handleMarkNotificationRead,
  handleMarkAllRead,
  handleClearRead,
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

          <div className="live-indicator">
            <span className="live-dot"></span>
            Live
          </div>
        </div>
      </div>

      <div className="header-actions">
        <NotificationBell
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          handleMarkNotificationRead={
            handleMarkNotificationRead
          }
          handleMarkAllRead={handleMarkAllRead}
          handleClearRead={handleClearRead}
        />

        <button
          type="button"
          onClick={handleChangeUser}
        >
          Change User
        </button>
      </div>
    </header>
  )
}

export default Header