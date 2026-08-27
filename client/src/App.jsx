import { useEffect, useState } from 'react'
import './App.css'

import UserSelect from './components/UserSelect'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import HandoverDetails from './components/HandoverDetails'
import EditHandoverForm from './components/EditHandoverForm'
import NotificationBanner from './components/NotificationBanner'
import AnalyticsPanel from './components/AnalyticsPanel'

import useSession from './hooks/useSession'
import useNotifications from './hooks/useNotifications'
import useHandovers from './hooks/useHandovers'
import useHandoverDetails from './hooks/useHandoverDetails'
import useAnalytics from './hooks/useAnalytics'

function App() {
  const [showAnalytics, setShowAnalytics] =
    useState(false)

  const session = useSession()

  const notification = useNotifications(
    session.currentUserId
  )

  const handover = useHandovers({
    currentUserId: session.currentUserId,
  })

  const details = useHandoverDetails({
    currentUserId: session.currentUserId,
    personnel: session.personnel,
    fetchHandovers: handover.fetchHandovers,
    processNewUpdates:
      notification.processNewUpdates,
    resetUpdateTracking:
      notification.resetUpdateTracking,
  })

  const analytics = useAnalytics(
    showAnalytics
  )

  useEffect(() => {
    if (!session.currentUserId) {
      return
    }

    const interval = setInterval(() => {
      if (details.selectedHandover) {
        details.handleSelectHandover(
          details.selectedHandover.id
        )
      } else {
        handover.fetchHandovers()
      }

      notification.fetchNotifications()
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [
    session.currentUserId,
    details.selectedHandover,
    handover.priorityFilter,
    handover.categoryFilter,
    handover.statusFilter,
  ])

  const handleChangeUser = async () => {
    await session.handleChangeUser()

    handover.resetHandovers()
    notification.resetNotifications()
    details.handleBack()

    setShowAnalytics(false)
  }

  if (!session.currentUser) {
    return (
      <UserSelect
        personnel={session.personnel}
        selectedUser={session.selectedUser}
        setSelectedUser={
          session.setSelectedUser
        }
        handleSubmit={
          session.handleSubmit
        }
      />
    )
  }

  const header = (
    <Header
      currentUser={session.currentUser}
      handleChangeUser={handleChangeUser}
      notifications={
        notification.notifications
      }
      showNotifications={
        notification.showNotifications
      }
      setShowNotifications={
        notification.setShowNotifications
      }
      handleMarkNotificationRead={
        notification.handleMarkNotificationRead
      }
      handleMarkAllRead={
        notification.handleMarkAllRead
      }
      handleClearRead={
        notification.handleClearRead
      }
    />
  )

  if (showAnalytics) {
    return (
      <main>
        <NotificationBanner
          notifications={
            notification.toastNotifications
          }
          dismissNotification={
            notification.dismissToastNotification
          }
        />

        {header}

        <AnalyticsPanel
          analytics={analytics.analytics}
          loading={analytics.loading}
          handleBack={() =>
            setShowAnalytics(false)
          }
        />
      </main>
    )
  }

  if (details.selectedHandover) {
    return (
      <main>
        <NotificationBanner
          notifications={
            notification.toastNotifications
          }
          dismissNotification={
            notification.dismissToastNotification
          }
        />

        {header}

        {details.isEditing ? (
          <EditHandoverForm
            editHandover={
              details.editHandover
            }
            personnel={
              session.personnel
            }
            handleEditChange={
              details.handleEditChange
            }
            handleSaveEdit={
              details.handleSaveEdit
            }
            handleCancelEdit={
              details.handleCancelEdit
            }
          />
        ) : (
          <HandoverDetails
            handover={
              details.selectedHandover
            }
            updates={
              details.updates
            }
            acknowledgments={
              details.acknowledgments
            }
            personnel={
              session.personnel
            }
            updateMessage={
              details.updateMessage
            }
            setUpdateMessage={
              details.setUpdateMessage
            }
            handleAddUpdate={
              details.handleAddUpdate
            }
            handleAcknowledge={
              details.handleAcknowledge
            }
            handleCloseHandover={
              details.handleCloseHandover
            }
            handleEditHandover={
              details.handleEditHandover
            }
            handleDeleteHandover={
              details.handleDeleteHandover
            }
            handleBack={
              details.handleBack
            }
          />
        )}
      </main>
    )
  }

  return (
    <main>
      <NotificationBanner
        notifications={
          notification.toastNotifications
        }
        dismissNotification={
          notification.dismissToastNotification
        }
      />

      {header}

      <Dashboard
        personnel={
          session.personnel
        }
        handovers={
          handover.handovers
        }
        showCreateForm={
          handover.showCreateForm
        }
        setShowCreateForm={
          handover.setShowCreateForm
        }
        newHandover={
          handover.newHandover
        }
        handleNewHandoverChange={
          handover.handleNewHandoverChange
        }
        handleCreateHandover={
          handover.handleCreateHandover
        }
        priorityFilter={
          handover.priorityFilter
        }
        setPriorityFilter={
          handover.setPriorityFilter
        }
        categoryFilter={
          handover.categoryFilter
        }
        setCategoryFilter={
          handover.setCategoryFilter
        }
        statusFilter={
          handover.statusFilter
        }
        setStatusFilter={
          handover.setStatusFilter
        }
        handleClearFilters={
          handover.handleClearFilters
        }
        handleSelectHandover={
          details.handleSelectHandover
        }
        handleShowAnalytics={() =>
          setShowAnalytics(true)
        }
      />
    </main>
  )
}

export default App