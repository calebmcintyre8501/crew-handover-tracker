function NotificationBell({
  notifications,
  showNotifications,
  setShowNotifications,
  handleMarkNotificationRead,
  handleMarkAllRead,
  handleClearRead,
}) {
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length

  return (
    <div className="notification-bell-wrapper">
      <button
        type="button"
        className="notification-bell"
        onClick={() =>
          setShowNotifications(
            (current) => !current
          )
        }
        aria-label="Notifications"
      >
        <span aria-hidden="true">🔔</span>

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <h2>Notifications</h2>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
              >
                Mark All Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="notification-empty">
              No notifications.
            </p>
          ) : (
            <div className="notification-list">
              {notifications.map(
                (notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className={
                      notification.is_read
                        ? 'notification-item read'
                        : 'notification-item unread'
                    }
                    onClick={() =>
                      handleMarkNotificationRead(
                        notification.id
                      )
                    }
                  >
                    <span
                      className={`notification-type notification-type-${notification.type}`}
                    />

                    <span>
                      <strong>
                        {notification.title}
                      </strong>

                      <span className="notification-message">
                        {notification.message}
                      </span>

                      <span className="notification-time">
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </span>
                    </span>
                  </button>
                )
              )}
            </div>
          )}

          {notifications.some(
            (notification) =>
              notification.is_read
          ) && (
            <div className="notification-panel-footer">
              <button
                type="button"
                onClick={handleClearRead}
              >
                Clear Read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell