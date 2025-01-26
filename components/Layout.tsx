import { ReactNode, useState } from 'react';
import { useCart } from '../context/cartContext';
import Modal from './Modal';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { cart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div id="body">
      <header>
        <h1>My Next.js Stripe App</h1>
        <div className="cart-icon" onClick={() => setIsModalOpen(true)} style={{ fontSize: '24px', cursor: 'pointer', position: 'relative' }}>
          🛒
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </div>
      </header>
      <main>{children}</main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Cart</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <article>
                <h3>{item.name}</h3>
                <p>
                  {item.price} {item.currency} x {item.quantity}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Modal>
      <footer>
        <p>&copy; 2023 My Next.js Stripe App</p>
      </footer>
    </div>
  );
};

export default Layout;