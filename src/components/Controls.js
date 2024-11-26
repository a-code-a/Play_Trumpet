import React from 'react';
import { SONG } from '../constants/notes';

const Controls = ({ 
  valves, 
  currentNoteIndex, 
  octave, 
  isPlaying, 
  onOctaveChange, 
  onPlayToggle 
}) => {
  return (
    <div className="controls">
      <div className="current-note-info">
        <h3>Aktuelle Note: {SONG[currentNoteIndex].text}</h3>
        <p>
          Ventilkombination: 
          {SONG[currentNoteIndex].combination === 'offen' 
            ? 'Keine Ventile' 
            : SONG[currentNoteIndex].combination}
        </p>
      </div>

      <div className="valves-section">
        <button className={`valve-button ${valves.valve1 ? 'pressed' : ''}`}>1</button>
        <button className={`valve-button ${valves.valve2 ? 'pressed' : ''}`}>2</button>
        <button className={`valve-button ${valves.valve3 ? 'pressed' : ''}`}>3</button>
      </div>

      <div className="octave-control">
        <label>Oktave: {octave}</label>
        <input
          type="range"
          min="1"
          max="7"
          value={octave}
          onChange={(e) => onOctaveChange(parseInt(e.target.value))}
        />
      </div>

      <div className="play-control">
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
