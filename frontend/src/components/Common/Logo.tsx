import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon - Calendar with Swap Arrows */}
      <div className={`relative ${sizeClasses[size]} text-indigo-600`}>
        {/* Calendar Base */}
        <div className="absolute inset-0 bg-indigo-100 rounded-lg flex items-center justify-center">
          {/* Date Number */}
          <div className="text-indigo-600 font-bold text-xs">X</div>
        </div>
        
        {/* Swap Arrows */}
        <div className="absolute -top-1 -right-1">
          <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -left-1">
          <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`font-bold text-gray-900 ${textSizes[size]}`}>
          SlotXchange
        </span>
      )}
    </div>
  );
};

export default Logo;