// NotificationList.tsx
import { useNotification } from './context/NotificationContext';
import { Button, List, ListItem, Typography, Divider } from '@mui/material';

export default function NotificationList() {
  const { notifications, clearNotifications } = useNotification();

  return (
    <div className="p-4">
      <Typography variant="h5">Notification History</Typography>
      <List>
        {notifications.map((notif) => (
          <div key={notif.id}>
            <ListItem>
              <Typography variant="body2">
                [{notif.timestamp.toLocaleTimeString()}] {notif.message}
              </Typography>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <Button
        onClick={clearNotifications}
        variant="contained"
        color="secondary"
      >
        Clear All
      </Button>
    </div>
  );
}
