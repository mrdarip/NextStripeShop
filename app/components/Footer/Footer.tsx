import Image from 'next/image';
import Link from 'next/link';
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/about">Sobre Nosotros</Link></li>
              <li><Link href="/returns">Política de Devoluciones</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Servicio al Cliente</h4>
            <ul>
              <li><Link href="/contact">Contáctanos</Link></li>
              <li><Link href="/returns">Cambios y Devoluciones</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Pagos Aceptados</h4>
            <div className={styles.paymentMethods}>
              <Image 
                src="/images/payment-logos/visa.png" 
                alt="Visa" 
                width={40} 
                height={24} 
              />
              <Image 
                src="/images/payment-logos/mastercard.png" 
                alt="Mastercard" 
                width={40} 
                height={24} 
              />
              <Image 
                src="/images/payment-logos/amex.png" 
                alt="American Express" 
                width={40} 
                height={24} 
              />
              <Image 
                src="/images/payment-logos/paypal.png" 
                alt="PayPal" 
                width={40} 
                height={24} 
              />
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>&copy; 2025 mkdarip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
