import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
  persistent?: boolean;
  read?: boolean;
}

export interface NotificationState {
  items: Notification[];
  maxItems: number;
  defaultDuration: number;
  showTimestamp: boolean;
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  enableSound: boolean;
  unreadCount: number;
}

// Initial state
const initialState: NotificationState = {
  items: [],
  maxItems: 5,
  defaultDuration: 6000,
  showTimestamp: true,
  position: 'top-center',
  enableSound: false,
  unreadCount: 0,
};

// Slice
export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      reducer: (state, action: PayloadAction<Notification>) => {
        const notification = action.payload;

        // Add to beginning of array
        state.items.unshift(notification);

        // Increment unread count if not read
        if (!notification.read) {
          state.unreadCount += 1;
        }

        // Remove oldest notifications if exceeding max
        if (state.items.length > state.maxItems) {
          const removed = state.items.splice(state.maxItems);
          // Decrease unread count for removed unread notifications
          removed.forEach((item) => {
            if (!item.read) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          });
        }
      },
      prepare: (notification: Omit<Notification, 'id' | 'timestamp'>) => ({
        payload: {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          read: false,
        },
      }),
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.items.findIndex((item) => item.id === id);

      if (index !== -1) {
        const notification = state.items[index];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items.splice(index, 1);
      }
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const notification = state.items.find((item) => item.id === id);

      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },

    clearReadNotifications: (state) => {
      state.items = state.items.filter((item) => !item.read);
    },

    updateNotification: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Notification> }>
    ) => {
      const { id, updates } = action.payload;
      const notification = state.items.find((item) => item.id === id);

      if (notification) {
        Object.assign(notification, updates);
      }
    },

    // Configuration
    setMaxItems: (state, action: PayloadAction<number>) => {
      state.maxItems = Math.max(1, action.payload);

      // Remove excess items if new max is lower
      if (state.items.length > state.maxItems) {
        const removed = state.items.splice(state.maxItems);
        removed.forEach((item) => {
          if (!item.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        });
      }
    },

    setDefaultDuration: (state, action: PayloadAction<number>) => {
      state.defaultDuration = Math.max(1000, action.payload);
    },

    setShowTimestamp: (state, action: PayloadAction<boolean>) => {
      state.showTimestamp = action.payload;
    },

    setPosition: (
      state,
      action: PayloadAction<NotificationState['position']>
    ) => {
      state.position = action.payload;
    },

    setEnableSound: (state, action: PayloadAction<boolean>) => {
      state.enableSound = action.payload;
    },

    // Bulk operations
    addMultipleNotifications: {
      reducer: (state, action: PayloadAction<Notification[]>) => {
        const notifications = action.payload;

        notifications.forEach((notification) => {
          state.items.unshift(notification);
          if (!notification.read) {
            state.unreadCount += 1;
          }
        });

        // Remove excess items
        if (state.items.length > state.maxItems) {
          const removed = state.items.splice(state.maxItems);
          removed.forEach((item) => {
            if (!item.read) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          });
        }
      },
      prepare: (notifications: Omit<Notification, 'id' | 'timestamp'>[]) => ({
        payload: notifications.map((notification) => ({
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          read: false,
        })),
      }),
    },

    removeMultipleNotifications: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;

      ids.forEach((id) => {
        const index = state.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          const notification = state.items[index];
          if (!notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.items.splice(index, 1);
        }
      });
    },
  },
});

// Actions
export const {
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  clearReadNotifications,
  updateNotification,
  setMaxItems,
  setDefaultDuration,
  setShowTimestamp,
  setPosition,
  setEnableSound,
  addMultipleNotifications,
  removeMultipleNotifications,
} = notificationSlice.actions;

// Selectors (commented out to avoid circular dependencies)
// export const selectNotifications = (state: RootState) => state.notifications.items;
// export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
// ... other selectors commented out

// Helper functions for creating common notification types
export const createSuccessNotification = (
  message: string,
  options?: Partial<Notification>
) => addNotification({ message, type: 'success', ...options });

export const createErrorNotification = (
  message: string,
  options?: Partial<Notification>
) => addNotification({ message, type: 'error', persistent: true, ...options });

export const createInfoNotification = (
  message: string,
  options?: Partial<Notification>
) => addNotification({ message, type: 'info', ...options });

export const createWarningNotification = (
  message: string,
  options?: Partial<Notification>
) => addNotification({ message, type: 'warning', ...options });

// Default export
export default notificationSlice.reducer;
