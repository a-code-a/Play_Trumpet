import React from 'react';
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
  onPlayToggle 
}) => {
  return (
    <div className="controls">
      <div className="scale-selector">
        <label>Tonleiter: </label>
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

      <div className="current-note-info">
        <h3>Aktuelle Note: {currentNote.text}</h3>
        <p>
          Ventilkombination: 
          {currentNote.combination === 'offen' 
            ? 'Keine Ventile' 
            : currentNote.combination}
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
