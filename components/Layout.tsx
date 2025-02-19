import { ReactNode } from 'react';
import Link from 'next/link';
import Cart from './Cart';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div id="body">
      <header>
        <h1><Link href={"/"}><img src='/images/logo.png' alt='logo'/>My Next.js Stripe App</Link></h1>
        <Cart />
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 My Next.js Stripe App</p>
      </footer>
    </div>
  );
};

export default Layout;