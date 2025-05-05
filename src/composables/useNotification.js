import { ref } from 'vue'

// Buat state global untuk notifikasi
const notifications = ref([])

/**
 * Composable for handling notifications
 *
 * @returns {Object} Notification methods and state
 */
export function useNotification() {
  /**
   * Add a new notification
   *
   * @param {Object} notification - The notification to add
   * @param {string} notification.title - Notification title
   * @param {string} notification.message - Notification message
   * @param {string} notification.type - Notification type (success, error, warning, info)
   * @param {number} [notification.timeout=5000] - Auto-close timeout in ms (0 for no auto-close)
   * @returns {string} The ID of the created notification
   */
  const notify = ({ title, message, type = 'info', timeout = 5000 }) => {
    const id = Date.now().toString()

    const notification = {
      id,
      title,
      message,
      type,
      timeout
    }

    notifications.value.push(notification)

    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }

    return id
  }

  /**
   * Remove a notification by ID
   *
   * @param {string} id - The notification ID to remove
   */
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Clear all notifications
   */
  const clearNotifications = () => {
    notifications.value = []
  }

  return {
    notifications,
    notify,
    removeNotification,
    clearNotifications
  }
}
