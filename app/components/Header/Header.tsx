"use client";

import { useEffect, useRef } from "react";
import Cart from "../Cart";
import styles from "./Header.module.css";

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // header has position absolute, so we need to check its position on scroll
    const handleScroll = () => {
      if (!headerRef.current) return;
      const headerHeight = window.pageYOffset;
      const isOnTop = headerHeight <= 0;

      if (isOnTop) {
        headerRef.current.classList.add(styles.sticky);
      } else {
        headerRef.current.classList.remove(styles.sticky);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={styles.header} ref={headerRef}>
      <h1>
        <a href="/">
          <img src="/images/logo.png" alt="logo" />
          mkdarip
        </a>
      </h1>
      <Cart />
    </header>
  );
}
