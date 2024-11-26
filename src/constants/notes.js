// Frequenztabelle für die Töne (in Hz)
export const NOTE_FREQUENCIES = {
  'c/4': 261.63,  // C4
  'd/4': 293.66,  // D4
  'e/4': 329.63,  // E4
  'f/4': 349.23,  // F4
  'g/4': 392.00,  // G4
  'a/4': 440.00,  // A4
  'b/4': 493.88,  // H4
};

// Musikstück: Alle meine Entchen in VexFlow-Notation
export const SONG = [
  // Takt 1
  { vexNote: 'c/4', combination: 'offen', text: 'Al-', frequency: NOTE_FREQUENCIES['c/4'], duration: '4' },
  { vexNote: 'd/4', combination: '1+3', text: 'le', frequency: NOTE_FREQUENCIES['d/4'], duration: '4' },
  { vexNote: 'e/4', combination: '1+2', text: 'mei-', frequency: NOTE_FREQUENCIES['e/4'], duration: '4' },
  { vexNote: 'f/4', combination: '1', text: 'ne', frequency: NOTE_FREQUENCIES['f/4'], duration: '4' },
  // Takt 2
  { vexNote: 'g/4', combination: 'offen', text: 'Ent-', frequency: NOTE_FREQUENCIES['g/4'], duration: '2' },
  { vexNote: 'g/4', combination: 'offen', text: 'chen', frequency: NOTE_FREQUENCIES['g/4'], duration: '2' },
  // Takt 3
  { vexNote: 'f/4', combination: '1', text: 'schwim-', frequency: NOTE_FREQUENCIES['f/4'], duration: '4' },
  { vexNote: 'f/4', combination: '1', text: 'men', frequency: NOTE_FREQUENCIES['f/4'], duration: '4' },
  { vexNote: 'e/4', combination: '1+2', text: 'auf', frequency: NOTE_FREQUENCIES['e/4'], duration: '4' },
  { vexNote: 'e/4', combination: '1+2', text: 'dem', frequency: NOTE_FREQUENCIES['e/4'], duration: '4' },
  // Takt 4
  { vexNote: 'd/4', combination: '1+3', text: 'See,', frequency: NOTE_FREQUENCIES['d/4'], duration: '2' },
  { vexNote: 'c/4', combination: 'offen', text: 'See.', frequency: NOTE_FREQUENCIES['c/4'], duration: '2' }
];
