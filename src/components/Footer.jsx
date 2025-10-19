import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        © 2025 DrillMasters LMS. All rights reserved.
      </div>

      <nav className={styles.links} aria-label="Footer navigation">
        <a href="https://www.drillmasters.in/index.html">Home</a> |
        <a href="https://www.drillmasters.in/about.html">About</a> |
        <a href="https://www.drillmasters.in/contact.html">Contact</a> |
        <a href="https://www.drillmasters.in/privacy.html">Privacy Policy</a> |
        <a href="https://www.drillmasters.in/terms.html">Terms of Use</a>
      </nav>

      <div className={styles.socials} aria-label="Social media links">
        <span className={styles.followLabel}>Follow us:</span>
        <a href="https://www.drillmasters.in/#">Facebook</a> |
        <a href="https://www.drillmasters.in/#">Twitter</a> |
        <a href="https://www.drillmasters.in/#">YouTube</a>
      </div>
    </footer>
  );
}
