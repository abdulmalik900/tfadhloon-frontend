'use client';

const BackgroundAnimations = ({ 
  variant = 'join',
  className = '' 
}) => {
  if (variant === 'waiting') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Simple waiting room background */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-300/20 rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-blue-300/15 rounded-full"></div>
        <div className="absolute bottom-20 left-16 w-24 h-24 bg-purple-300/10 rounded-full"></div>
        <div className="absolute bottom-32 right-20 w-12 h-12 bg-yellow-300/25 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Simple background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300/20 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-300/10 rounded-full"></div>
      <div className="absolute bottom-40 right-16 w-28 h-28 bg-blue-300/15 rounded-full"></div>
    </div>
  );
};

export default BackgroundAnimations;
