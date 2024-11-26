import { useState, useEffect } from 'react';

export const useValves = () => {
  const [valves, setValves] = useState({
    valve1: false,
    valve2: false,
    valve3: false
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['1', '2', '3'].includes(event.key) && !event.repeat) {
        const valveNumber = parseInt(event.key);
        setValves(prev => ({
          ...prev,
          [`valve${valveNumber}`]: true
        }));
      }
    };

    const handleKeyUp = (event) => {
      if (['1', '2', '3'].includes(event.key)) {
        const valveNumber = parseInt(event.key);
        setValves(prev => ({
          ...prev,
          [`valve${valveNumber}`]: false
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getValveCombination = () => {
    const pressedValves = Object.entries(valves)
      .filter(([_, isPressed]) => isPressed)
      .map(([valve]) => valve.replace('valve', ''))
      .sort()
      .join('+');
    
    return pressedValves || 'offen';
  };

  return {
    valves,
    getValveCombination
  };
};
