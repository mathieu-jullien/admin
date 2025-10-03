import { Link, useLocation } from 'react-router-dom';
import type { MenuItem } from '../../../types/layout/menu/MenuItem';

interface MenuProps {
  menuItems: MenuItem[];
}

export default function Menu({ menuItems }: MenuProps) {
  const location = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-gray-800 text-white border-r-gray-600 border-r p-4 w-48 h-full`}
    >
      <nav className="space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex justify-between cursor-pointer hover:bg-gray-600 p-2 rounded transition-colors ${
              isActiveRoute(item.href) ? 'bg-gray-600' : ''
            }`}
          >
            {item.label}
            {item.soon ? (
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 inset-ring inset-ring-purple-700/10 ml-1">
                Bientôt
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
