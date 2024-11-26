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

  'c/5': 523.25,  // C5
  'c#/5': 554.37, // C#5
  'd/5': 587.33,  // D5
  'd#/5': 622.25, // D#5
  'e/5': 659.25,  // E5
  'f/5': 698.46,  // F5
  'f#/5': 739.99, // F#5
  'g/5': 783.99,  // G5
  'g#/5': 830.61, // G#5
  'a/5': 880.00,  // A5
  'a#/5': 932.33, // A#5
  'b/5': 987.77,  // H5
};

// Ventilkombinationen für jeden Ton
const VALVE_COMBINATIONS = {
  'c/4': 'offen', 'c#/4': '1+2+3', 'd/4': '1+3', 'd#/4': '2+3', 
  'e/4': '1+2', 'f/4': '1', 'f#/4': '2', 'g/4': 'offen', 
  'g#/4': '2+3', 'a/4': '1+2', 'a#/4': '1', 'b/4': '2',

  'c/5': 'offen', 'c#/5': '1+2+3', 'd/5': '1+3', 'd#/5': '2+3', 
  'e/5': '1+2', 'f/5': '1', 'f#/5': '2', 'g/5': 'offen', 
  'g#/5': '2+3', 'a/5': '1+2', 'a#/5': '1', 'b/5': '2'
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

// Verschiedene Tonleitern in der Standard-Spielrange
export const SCALES = {
  'C-Dur': createScale([
    'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 
    'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5', 'b/5'
  ]),
  
  'Chromatisch': createScale([
    'c/4', 'c#/4', 'd/4', 'd#/4', 'e/4', 'f/4', 'f#/4', 
    'g/4', 'g#/4', 'a/4', 'a#/4', 'b/4', 
    'c/5', 'c#/5', 'd/5', 'd#/5', 'e/5', 'f/5', 'f#/5', 
    'g/5', 'g#/5', 'a/5', 'a#/5', 'b/5'
  ]),
  
  'G-Dur': createScale([
    'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f#/5', 
    'g/5', 'a/5', 'b/5'
  ]),
  
  'F-Dur': createScale([
    'f/4', 'g/4', 'a/4', 'a#/4', 'c/5', 'd/5', 'e/5', 
    'f/5', 'g/5', 'a/5', 'a#/5'
  ]),
  
  'D-Dur': createScale([
    'd/4', 'e/4', 'f#/4', 'g/4', 'a/4', 'b/4', 'c#/5', 
    'd/5', 'e/5', 'f#/5', 'g/5', 'a/5', 'b/5'
  ]),

  'Ganzton': createScale([
    'c/4', 'd/4', 'e/4', 'f#/4', 'g#/4', 'a#/4', 
    'c/5', 'd/5', 'e/5', 'f#/5', 'g#/5', 'a#/5'
  ])
};
