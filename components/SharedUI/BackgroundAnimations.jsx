'use client';

const BackgroundAnimations = ({ 
  variant = 'join', // 'join' or 'waiting'
  className = '' 
}) => {
  if (variant === 'waiting') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Waiting room background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-300/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-blue-300/15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-16 w-24 h-24 bg-purple-300/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-20 w-12 h-12 bg-yellow-300/25 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '4s' }}></div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Join screen background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-300/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-16 w-28 h-28 bg-blue-300/15 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      
      {/* Additional floating elements */}
      <div className="absolute top-1/2 left-8 w-16 h-16 bg-cyan-300/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-3/4 right-8 w-20 h-20 bg-indigo-300/15 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Small floating particles */}
      <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '3.5s' }}></div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
    </div>
  );
};

export default BackgroundAnimations;
