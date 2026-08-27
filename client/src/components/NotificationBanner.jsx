function NotificationBanner({
  notifications,
  dismissNotification,
}) {
  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>

          <button
            type="button"
            onClick={() =>
              dismissNotification(notification.id)
            }
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationBanner