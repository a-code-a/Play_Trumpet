import React, { useEffect, useRef } from 'react';
import { Vex } from 'vexflow';

const Score = ({ notes, currentNoteIndex, isPlaying }) => {
  const scoreRef = useRef(null);

  useEffect(() => {
    if (scoreRef.current) {
      // Canvas leeren
      while (scoreRef.current.firstChild) {
        scoreRef.current.removeChild(scoreRef.current.firstChild);
      }

      const VF = Vex.Flow;
      
      // Renderer erstellen
      const renderer = new VF.Renderer(
        scoreRef.current,
        VF.Renderer.Backends.SVG
      );

      // Größe setzen
      renderer.resize(800, 150);
      const context = renderer.getContext();

      // Notensystem erstellen
      const stave = new VF.Stave(10, 40, 750);
      stave.addClef('treble').addTimeSignature('4/4');
      stave.setContext(context).draw();

      // Noten erstellen
      const vexNotes = notes.map((note, index) => {
        const noteKey = note.vexNote.split('/')[0];
        const octave = note.vexNote.split('/')[1];
        
        // Unterscheidung zwischen normalen und Vorzeichen-Noten
        const keys = [`${noteKey}/${octave}`];
        
        const staveNote = new VF.StaveNote({
          clef: "treble",
          keys: keys,
          duration: note.duration
        });
        
        // Aktuelle Note hervorheben
        if (isPlaying && index === currentNoteIndex) {
          staveNote.setStyle({ fillStyle: 'blue', strokeStyle: 'blue' });
        }

        // Verbesserte Vorzeichen-Behandlung
        if (noteKey.includes('#')) {
          const accidental = new VF.Accidental("#");
          staveNote.addModifier(accidental, 0);
        } else if (noteKey.includes('b')) {
          const accidental = new VF.Accidental("b");
          staveNote.addModifier(accidental, 0);
        }
        
        return staveNote;
      });

      // Voice erstellen
      const voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
      voice.addTickables(vexNotes);

      // Formatter erstellen und anwenden
      const formatter = new VF.Formatter()
        .joinVoices([voice])
        .format([voice], 700);

      // Voice zeichnen
      voice.draw(context, stave);

      // Beams für aufeinanderfolgende Achtelnoten erstellen
      const beams = VF.Beam.generateBeams(vexNotes.filter(note => note.duration === '8'));
      beams.forEach(beam => beam.setContext(context).draw());
    }
  }, [notes, currentNoteIndex, isPlaying]);

  return <div className="score-container" ref={scoreRef}></div>;
};

export default Score;
