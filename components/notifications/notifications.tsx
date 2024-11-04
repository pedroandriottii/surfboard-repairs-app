import { useState, useEffect } from 'react';
import { Bell, CircleArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';

interface Notification {
  id: string;
  title: string;
  message: string;
  url: string;
  image: string;
  isRead: boolean;
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/user/${user?.email}`);
      const data = await response.json();
      setNotifications(data);
      const unread = data.filter((notification: Notification) => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
      });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="relative">
      <div onClick={toggleDropdown} className="cursor-pointer relative text-realce">
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-10">
          <h3 className="font-semibold text-lg mb-2">Notificações</h3>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between w-full rounded p-2 ${index < notifications.length - 1 ? 'border-b border-gray-300' : ''
                  }`}
              >
                <Link href={notification.url} onClick={() => markAsRead(notification.id)}>
                  <div className="flex items-center gap-4">
                    <Image
                      src={notification.image}
                      alt="Notification"
                      width={50}
                      height={50}
                    />
                    <div className={`flex-1 ${notification.isRead ? 'text-gray-500' : 'text-black'}`}>
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  </div>
                </Link>
                <CircleArrowRight />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma notificação disponível</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
