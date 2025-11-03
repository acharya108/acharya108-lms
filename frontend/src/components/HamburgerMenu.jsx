import React, { useState } from 'react';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <button onClick={() => setOpen(!open)} aria-label="Menu toggle">
      {open ? 'Close' : 'Menu'}
    </button>
  );
}
