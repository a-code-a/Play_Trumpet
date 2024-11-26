import React, { useEffect, useRef } from 'react';
import { Vex } from 'vexflow';
import { SONG } from '../constants/notes';

const Score = ({ currentNoteIndex, isPlaying }) => {
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
      renderer.resize(800, 200);
      const context = renderer.getContext();

      // Erste Zeile
      const stave1 = new VF.Stave(10, 40, 380);
      stave1.addClef('treble').addTimeSignature('4/4');
      stave1.setContext(context).draw();

      const stave2 = new VF.Stave(390, 40, 380);
      stave2.setContext(context).draw();

      // Zweite Zeile
      const stave3 = new VF.Stave(10, 140, 380);
      stave3.setContext(context).draw();

      const stave4 = new VF.Stave(390, 140, 380);
      stave4.setContext(context).draw();

      // Takte definieren
      const measures = [
        SONG.slice(0, 4),   // Takt 1
        SONG.slice(4, 6),   // Takt 2
        SONG.slice(6, 10),  // Takt 3
        SONG.slice(10, 12)  // Takt 4
      ];

      // Noten für jeden Takt erstellen und zeichnen
      const staves = [stave1, stave2, stave3, stave4];
      measures.forEach((measure, index) => {
        const notes = measure.map(note => {
          const staveNote = new VF.StaveNote({
            clef: "treble",
            keys: [note.vexNote],
            duration: note.duration
          });
          
          // Aktuelle Note hervorheben
          if (isPlaying && Math.floor(currentNoteIndex / 4) === index) {
            const noteInMeasure = currentNoteIndex % 4;
            if (measures[index].indexOf(note) === noteInMeasure) {
              staveNote.setStyle({ fillStyle: 'blue', strokeStyle: 'blue' });
            }
          }
          
          return staveNote;
        });

        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(notes);

        const formatter = new VF.Formatter()
          .joinVoices([voice])
          .format([voice], 340);

        voice.draw(context, staves[index]);
      });
    }
  }, [currentNoteIndex, isPlaying]);

  return <div className="score-container" ref={scoreRef}></div>;
};

export default Score;
