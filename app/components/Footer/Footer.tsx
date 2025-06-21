import Image from 'next/image';
import Link from 'next/link';
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/returns">Returns Policy</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Customer Service</h4>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/returns">Returns & Exchange</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>We Accept</h4>
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
