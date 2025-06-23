import { useState, useEffect } from 'react';

const AnimatedBackground = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, ${0.1 + Math.sin(pulse * 0.1) * 0.05}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, ${0.1 + Math.sin(pulse * 0.1) * 0.05}) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        transform: `scale(${1 + Math.sin(pulse * 0.1) * 0.05})`,
        transition: 'all 0.1s ease',
      }}
    />
  );
};

export default AnimatedBackground;
