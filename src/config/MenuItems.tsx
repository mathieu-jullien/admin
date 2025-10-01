import type { MenuItem } from '../types/layout/menu/MenuItem';

export const menuItems: MenuItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Dashboard', href: '/dashboard', soon: true },
  { label: 'Expériences', href: '/experiences' },
  { label: 'Compétences', href: '/skills' },
  { label: 'Formations', href: '/formations' },
  { label: 'Projets', href: '/projets', soon: true },
  { label: 'Contact', href: '/contact', soon: true },
];
