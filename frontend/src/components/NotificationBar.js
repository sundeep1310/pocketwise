import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/notifications');
        setNotifications(data.filter(n => !n.read));
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async () => {
    try {
      await API.post('/notifications/mark-read');
      setNotifications([]);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark notifications as read");
    }
  };

  if (loading || notifications.length === 0) return null;

  return (
    <div className={`notification-bar ${expanded ? 'expanded' : ''}`}>
      <div className="notification-header" onClick={() => setExpanded(!expanded)}>
        <div className="notification-icon">
          <i className="fas fa-bell"></i>
          <span className="notification-count">{notifications.length}</span>
        </div>
        <h3>Notifications</h3>
        <button className="toggle-btn">
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
        </button>
      </div>
      
      {expanded && (
        <div className="notification-content">
          {notifications.map(notification => (
            <div key={notification._id} className="notification-item">
              <div className="notification-item-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="notification-item-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.date).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          
          <button className="mark-read-btn" onClick={handleMarkRead}>
            <i className="fas fa-check-double"></i>
            <span>Mark all as read</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
