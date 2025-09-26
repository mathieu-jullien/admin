import type { MenuItem } from '../../../types/layout/menu/MenuItem';

interface MenuProps {
  menuItems: MenuItem[];
}

export default function Menu({ menuItems }: MenuProps) {
  return (
    <aside
      className={`bg-gray-800 text-white border-r-gray-600 border-r p-4 w-48 h-full`}
    >
      <nav className="space-y-2">
        {menuItems.map(item => (
          <a
            key={item.label}
            href={item.href}
            className={
              'block cursor-pointer hover:bg-gray-600 p-2 rounded transition-colors ' +
              item.active
            }
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
