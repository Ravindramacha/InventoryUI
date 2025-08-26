import { Snackbar, Alert } from '@mui/material';
import { useNotification } from './context/NotificationContext';
import { useEffect, useState } from 'react';

type Notification = {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
};

export default function NotificationSnackbar() {
  const { notifications } = useNotification();
  const [queue, setQueue] = useState<Notification[]>([]);
  const [current, setCurrent] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      // Push new notifications to queue
      setQueue((prev) => [...prev, ...notifications.slice(prev.length)]);
    }
  }, [notifications]);

  useEffect(() => {
    if (!open && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      setOpen(true);
    }
  }, [queue, open]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {current && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={current.type} variant="filled" onClose={handleClose}>
            {current.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
