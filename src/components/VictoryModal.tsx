import React from 'react';
import { TEAM_COLOR_VARS } from '../data/familyData';
import { GameState } from '../types';
import { ConfettiCanvas } from './ConfettiCanvas';

interface VictoryModalProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  gameState,
  onPlayAgain,
  onClose,
}) => {
  const { n, pts, done, turn } = gameState;
  const completedCount = Object.keys(done).length;
  const ranking = pts
    .map((points, idx) => ({ points, idx }))
    .sort((a, b) => b.points - a.points);
  const isTie = n > 1 && ranking[1] && ranking[1].points === ranking[0].points;
  const getTeamName = (idx: number) => (n === 1 ? 'Jugador' : `Equipo ${idx + 1}`);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#0A0C10]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <ConfettiCanvas />
      <div className="relative z-10 bg-[var(--card)] text-[var(--ink)] border-2 border-[var(--line)]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-pop flex flex-col gap-4 my-auto">
        <div className="text-xs uppercase tracking-wider font-extrabold text-[var(--muted)] text-center">
          {getTeamName(turn)} llegó a la META (+3 pts)
        </div>
        <h2 className="font-hand text-4xl text-center text-[var(--accent)] font-normal m-0">
          ¡Fin del juego!
        </h2>
        <p className="text-sm sm:text-base text-center leading-relaxed text-[var(--ink)] m-0">
          {n > 1 ? (
            isTie ? (
              <>¡Gran competencia! Hay un empate en el primer lugar.</>
            ) : (
              <>
                ¡Felicitaciones! Gana el{' '}
                <span className="font-bold">{getTeamName(ranking[0].idx)}</span>{' '}
                con <span className="font-bold">{ranking[0].points}</span> puntos.
              </>
            )
          ) : (
            <>
              ¡Excelente recorrido! Terminaste con{' '}
              <span className="font-bold">{pts[0]}</span> puntos.
            </>
          )}
          <br />
          <span className="text-[var(--muted)] text-xs sm:text-sm">
            Retratos completados: {completedCount} de 22.
          </span>
        </p>

        <ul className="flex flex-col gap-2 my-1 p-0 list-none border-y border-[var(--line)]/15 py-3">
          {ranking.map(({ points, idx }) => (
            <li
              key={`rank-${idx}`}
              className="flex items-center gap-3 font-bold text-sm sm:text-base"
            >
              <span
                className="w-4 h-4 rounded-full border border-[var(--line)]"
                style={{ background: `var(${TEAM_COLOR_VARS[idx]})` }}
              />
              <span>{getTeamName(idx)}</span>
              <span className="ml-auto font-hand text-2xl font-bold tabular-nums">
                {points} pts
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-center gap-3 mt-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="px-5 py-2.5 rounded-xl font-bold bg-[var(--line)] text-[var(--paper)] hover:opacity-90 shadow-sm transition-all cursor-pointer text-sm"
          >
            Jugar de nuevo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold border-2 border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper)] transition-all cursor-pointer text-sm"
          >
            Ver la casa
          </button>
        </div>
      </div>
    </div>
  );
};
