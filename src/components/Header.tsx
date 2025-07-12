"use client";

import Link from "next/link";
import Cart from "./Cart";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const showCart = !pathname.startsWith("/dashboard");

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">StoreGenie</span>
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          </Link>
        </div>
        <div className="flex lg:flex-1 lg:justify-end">
          {showCart && <Cart />}
        </div>
      </nav>
    </header>
  );
}