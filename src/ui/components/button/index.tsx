import type { FC, ReactNode } from 'react';

import './style.css';

export interface ButtonProps {
  children: ReactNode
  onClick: () => void
}

export const Button: FC<ButtonProps> = ({ children, onClick }) => (
  <button className="button" type="button" onClick={onClick}>{children}</button>
);
