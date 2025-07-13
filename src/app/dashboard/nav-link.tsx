"use client";

import Link from 'next/link';
import React from 'react';

import { BarChart, LayoutDashboard, Palette, ShoppingBag } from 'lucide-react';

interface NavLinkProps {
  href: string;
  iconName: string;
  name: string;
  comingSoon?: boolean;
}

const icons: { [key: string]: React.ElementType } = {
  LayoutDashboard,
  ShoppingBag,
  BarChart,
  Palette,
};

export function NavLink({ href, iconName, name, comingSoon }: NavLinkProps) {
  const Icon = icons[iconName];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (comingSoon) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href={comingSoon ? '#' : href}
      onClick={handleClick}
      className={`flex items-center px-4 py-2 text-muted-foreground rounded-lg transition-colors ${
        comingSoon
          ? 'cursor-not-allowed text-muted-foreground/60'
          : 'hover:bg-magic-accent/20 hover:text-foreground'
      }`}
    >
      {Icon && <Icon className="h-5 w-5 mr-3" />}
      <span>{name}</span>
      {comingSoon && (
        <span className="ml-auto text-[9px] font-bold bg-magic-accent/20 text-magic-primary px-2 py-0.5 rounded-md">
          SOON
        </span>
      )}
    </Link>
  );
}