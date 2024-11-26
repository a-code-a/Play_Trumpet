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

      // Größe deutlich erhöht
      renderer.resize(1200, 400);
      const context = renderer.getContext();

      // Notensystem erstellen mit mehr Platz
      const stave = new VF.Stave(10, 40, 1100);
      stave.addClef('treble').addTimeSignature('4/4');
      stave.setContext(context).draw();

      // Noten erstellen
      const vexNotes = notes.map((note, index) => {
        const noteKey = note.vexNote.split('/')[0];
        const octave = note.vexNote.split('/')[1];
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

        // Vorzeichen korrekt hinzufügen
        if (noteKey.includes('#')) {
          staveNote.addModifier(new VF.Accidental("#"), 0);
        } else if (noteKey.includes('b')) {
          staveNote.addModifier(new VF.Accidental("b"), 0);
        }
        
        return staveNote;
      });

      // Voice erstellen
      const voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
      voice.addTickables(vexNotes);

      // Formatter erstellen und anwenden
      const formatter = new VF.Formatter()
        .joinVoices([voice])
        .format([voice], 1050);

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
