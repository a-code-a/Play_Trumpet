import React, { useState } from 'react';
import { SCALES } from '../constants/notes';

const Controls = ({ 
  valves, 
  currentNoteIndex,
  currentScale,
  currentNote, 
  octave, 
  isPlaying,
  onScaleChange, 
  onOctaveChange, 
  onPlayToggle,
  onKeyMapChange,
  className
}) => {
  const [keyMap, setKeyMap] = useState({
    valve1: '1',
    valve2: '2',
    valve3: '3'
  });

  const handleKeyAssign = (valve, newKey) => {
    const updatedKeyMap = {
      ...keyMap,
      [valve]: newKey.toLowerCase()
    };
    setKeyMap(updatedKeyMap);
    onKeyMapChange(updatedKeyMap);
  };

  return (
    <div className={className}>
      <div className="sidebar-section">
        <h3>Tonleiter</h3>
        <select 
          value={currentScale} 
          onChange={(e) => onScaleChange(e.target.value)}
          disabled={isPlaying}
        >
          {Object.keys(SCALES).map(scale => (
            <option key={scale} value={scale}>{scale}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <h3>Ventile & Aktuelle Note</h3>
        <div className="valves-section">
          {['valve1', 'valve2', 'valve3'].map((valve, index) => (
            <div key={valve} className="valve-input-group">
              <button 
                className={`valve-button ${valves[valve] ? 'pressed' : ''}`}
              >
                {index + 1}
              </button>
              <input 
                type="text" 
                maxLength="1"
                value={keyMap[valve]}
                onChange={(e) => handleKeyAssign(valve, e.target.value)}
                placeholder={`Taste für Ventil ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <div className="note-info">
          <p>Aktuelle Note: {currentNote.text}</p>
          <p>
            Ventilkombination: 
            {currentNote.combination === 'offen' 
              ? 'Keine Ventile' 
              : currentNote.combination}
          </p>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Oktave</h3>
        <label>Aktuelle Oktave: {octave}</label>
        <input
          type="range"
          min="1"
          max="7"
          value={octave}
          onChange={(e) => onOctaveChange(parseInt(e.target.value))}
        />
      </div>

      <div className="sidebar-section">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`} 
          onClick={onPlayToggle}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default Controls;
