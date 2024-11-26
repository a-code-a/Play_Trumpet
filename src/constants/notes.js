// Frequenztabelle für die Töne (in Hz)
export const NOTE_FREQUENCIES = {
  'c/4': 261.63,  // C4
  'c#/4': 277.18, // C#4
  'd/4': 293.66,  // D4
  'd#/4': 311.13, // D#4
  'e/4': 329.63,  // E4
  'f/4': 349.23,  // F4
  'f#/4': 369.99, // F#4
  'g/4': 392.00,  // G4
  'g#/4': 415.30, // G#4
  'a/4': 440.00,  // A4
  'a#/4': 466.16, // A#4
  'b/4': 493.88,  // H4
};

// Ventilkombinationen für jeden Ton
const VALVE_COMBINATIONS = {
  'c/4': 'offen',    // C
  'c#/4': '1+2+3',   // C#
  'd/4': '1+3',      // D
  'd#/4': '2+3',     // D#
  'e/4': '1+2',      // E
  'f/4': '1',        // F
  'f#/4': '2',       // F#
  'g/4': 'offen',    // G
  'g#/4': '2+3',     // G#
  'a/4': '1+2',      // A
  'a#/4': '1',       // A#
  'b/4': '2',        // H
};

// Funktion zum Erstellen einer Tonleiter
const createScale = (notes, duration = '4') => {
  return notes.map(note => ({
    vexNote: note,
    combination: VALVE_COMBINATIONS[note],
    text: note.split('/')[0].toUpperCase(),
    frequency: NOTE_FREQUENCIES[note],
    duration: duration
  }));
};

// Verschiedene Tonleitern
export const SCALES = {
  'C-Dur': createScale([
    'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/4'
  ]),
  
  'Chromatisch': createScale([
    'c/4', 'c#/4', 'd/4', 'd#/4', 'e/4', 'f/4', 
    'f#/4', 'g/4', 'g#/4', 'a/4', 'a#/4', 'b/4', 'c/4'
  ]),
  
  'G-Dur': createScale([
    'g/4', 'a/4', 'b/4', 'c/4', 'd/4', 'e/4', 'f#/4', 'g/4'
  ]),
  
  'F-Dur': createScale([
    'f/4', 'g/4', 'a/4', 'a#/4', 'c/4', 'd/4', 'e/4', 'f/4'
  ]),
  
  'D-Dur': createScale([
    'd/4', 'e/4', 'f#/4', 'g/4', 'a/4', 'b/4', 'c#/4', 'd/4'
  ]),

  'Ganzton': createScale([
    'c/4', 'd/4', 'e/4', 'f#/4', 'g#/4', 'a#/4', 'c/4'
  ])
};
