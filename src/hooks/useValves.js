import { useState, useEffect } from 'react';

export const useValves = (customKeyMap = {
  valve1: ['1', 'q'],
  valve2: ['2', 'w'],
  valve3: ['3', 'e']
}) => {
  const [valves, setValves] = useState({
    valve1: false,
    valve2: false,
    valve3: false
  });

  const [keyMap, setKeyMap] = useState(customKeyMap);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const pressedKey = event.key.toLowerCase();
      
      Object.entries(keyMap).forEach(([valve, keys]) => {
        if (keys.includes(pressedKey) && !event.repeat) {
          setValves(prev => ({
            ...prev,
            [valve]: true
          }));
        }
      });
    };

    const handleKeyUp = (event) => {
      const pressedKey = event.key.toLowerCase();
      
      Object.entries(keyMap).forEach(([valve, keys]) => {
        if (keys.includes(pressedKey)) {
          setValves(prev => ({
            ...prev,
            [valve]: false
          }));
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyMap]);

  const getValveCombination = () => {
    const pressedValves = Object.entries(valves)
      .filter(([_, isPressed]) => isPressed)
      .map(([valve]) => valve.replace('valve', ''))
      .sort()
      .join('+');
    
    return pressedValves || 'offen';
  };

  const updateKeyMap = (newKeyMap) => {
    setKeyMap(newKeyMap);
  };

  return {
    valves,
    getValveCombination,
    updateKeyMap
  };
};
