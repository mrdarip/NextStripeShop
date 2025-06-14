import styles from './Banner.module.css';
import Image from 'next/image';

export default function Banner() {
  return <Image width={1920} height={1080} className={styles.bannerImage} src="/images/banner.jpg" alt="Store Banner" />;
}
