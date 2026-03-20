import React from 'react';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { ViewState } from '../types';

interface NavigationLinkProps {
  path: string; // e.g., "dashboard/metrics"
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({ path, children, className, onClick, title }) => {
  const { navigate } = useAppNavigation();
  
  const handleClick = () => {
    if (onClick) onClick();
    const [view, section] = path.split('/');
    navigate(view as ViewState, section || null);
  };
  
  return (
    <div onClick={handleClick} className={`${className} cursor-pointer`} title={title}>
      {children}
    </div>
  );
};
