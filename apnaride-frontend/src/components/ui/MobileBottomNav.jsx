import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: 'fa-solid fa-house',
    path: '/customer',
  },
  {
    id: 'rides',
    label: 'Rides',
    icon: 'fa-solid fa-clock-rotate-left',
    path: '/customer/profile',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: 'fa-solid fa-wallet',
    path: '/customer/profile',
  },
  {
    id: 'account',
    label: 'Account',
    icon: 'fa-solid fa-user',
    path: '/customer/profile',
  },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (!isMobile) return null;

  const handleClick = (item) => {
    if (location.pathname === item.path) return;
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 pb-safe">
      <div className="max-w-xl mx-auto flex items-center justify-between px-4 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center justify-center flex-1 gap-1 py-1 min-h-[48px] text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <i
                className={`${item.icon} text-lg ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
