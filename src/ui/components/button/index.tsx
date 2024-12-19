import type { FC, ReactNode } from 'react';

import './style.css';

export interface ButtonProps {
  className?: string
  children: ReactNode
  onClick: () => void
}

export const Button: FC<ButtonProps> = ({ className = '', children, onClick }) => (
  <button
    className={`button ${className}`}
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
);
