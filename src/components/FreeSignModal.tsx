import React from 'react';
import { GameState } from '../types';

interface FreeSignModalProps {
  squareNumber: number;
  gameState: GameState;
  onSuccess: () => void;
  onFail: () => void;
}

export const FreeSignModal: React.FC<FreeSignModalProps> = ({
  squareNumber,
  gameState,
  onSuccess,
  onFail,
}) => {
  const teamLabel =
    gameState.n === 1 ? 'Jugador' : `Equipo ${gameState.turn + 1}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#0A0C10]/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-[var(--card)] text-[var(--ink)] border-2 border-[var(--line)]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-pop flex flex-col gap-3 my-auto">
        <div className="text-xs uppercase tracking-wider font-extrabold text-[var(--muted)]">
          {teamLabel} · Casilla {squareNumber}
        </div>
        <div className="text-5xl text-center select-none" aria-hidden="true">
          ✋
        </div>
        <h2 className="font-hand text-3xl text-center text-[var(--accent)] font-normal m-0">
          Seña libre
        </h2>
        <p className="text-sm sm:text-base text-center leading-relaxed text-[var(--ink)]">
          El señante hace{' '}
          <span className="font-bold">cualquier seña de la familia</span> sin
          mirar. El grupo o su equipo adivina cuál es y el docente evalúa si fue
          bien ejecutada.
        </p>
        <div className="bg-[var(--paper)] border border-[var(--line)]/15 rounded-xl px-3.5 py-2.5 text-xs text-center text-[var(--muted)] leading-relaxed">
          <span className="font-bold text-[var(--ink)] block mb-0.5">
            Reto opcional en frase
          </span>
          «El que está en la foto es mi tío, el hermano de mi mamá»
        </div>
        <div className="flex justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={onSuccess}
            className="px-4 py-2.5 rounded-xl font-bold bg-[var(--good)] text-white hover:opacity-90 shadow-sm transition-all cursor-pointer text-sm"
          >
            Bien hecha (+1)
          </button>
          <button
            type="button"
            onClick={onFail}
            className="px-4 py-2.5 rounded-xl font-bold border-2 border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper)] transition-all cursor-pointer text-sm"
          >
            No fue correcta
          </button>
        </div>
      </div>
    </div>
  );
};
