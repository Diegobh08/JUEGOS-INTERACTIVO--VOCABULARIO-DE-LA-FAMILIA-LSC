import React, { useState } from 'react';
import { QUESTIONS, WORD_MAP, getSignImageUrl } from '../data/familyData';
import { GameState } from '../types';
import { FamilyTree } from './FamilyTree';

interface QuestionModalProps {
  wordId: string;
  squareNumber: number;
  options: string[];
  gameState: GameState;
  videos: Record<string, string>;
  onAnswer: (selectedId: string) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  wordId,
  squareNumber,
  options,
  gameState,
  videos,
  onAnswer,
  onClose,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [optionMode, setOptionMode] = useState<'video' | 'image'>('video');

  const question = QUESTIONS[wordId];
  const targetWord = WORD_MAP[wordId];
  const anyHasVideo = options.some((id) => Boolean(videos[id]));
  const answered = selected !== null;
  const isCorrect = selected === wordId;
  const teamLabel =
    gameState.n === 1 ? 'Jugador' : `Equipo ${gameState.turn + 1}`;

  const handleSelect = (optId: string) => {
    if (answered) return;
    setSelected(optId);
    onAnswer(optId);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#0A0C10]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-[var(--card)] text-[var(--ink)] border-2 border-[var(--line)]/20 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl animate-pop grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 my-auto">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider font-extrabold text-[var(--muted)]">
            {teamLabel} · Casilla {squareNumber} · Retrato familiar
          </div>
          <div className="bg-[var(--paper)] rounded-xl p-2 border border-[var(--line)]/20">
            <FamilyTree
              target={question?.t ?? null}
              crop={true}
              gameState={gameState}
              idPrefix="modal"
            />
          </div>
          <p className="text-xs text-[var(--muted)] text-center font-hand">
            Observa atentamente el árbol familiar para responder
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b-2 border-[var(--accent)]">
            <h2 className="font-hand text-3xl sm:text-4xl text-[var(--ink)] font-normal m-0">
              ¿Qué seña es?
            </h2>
            {anyHasVideo && (
              <div
                className="inline-flex rounded-xl border-2 border-[var(--line)]/25 bg-[var(--paper)] p-0.5 text-xs font-bold"
                role="group"
                aria-label="Formato de las señas"
              >
                <button
                  type="button"
                  onClick={() => setOptionMode('video')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    optionMode === 'video'
                      ? 'bg-[var(--line)] text-[var(--paper)]'
                      : 'text-[var(--ink)] hover:bg-[var(--card)]'
                  }`}
                >
                  Videos
                </button>
                <button
                  type="button"
                  onClick={() => setOptionMode('image')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    optionMode === 'image'
                      ? 'bg-[var(--line)] text-[var(--paper)]'
                      : 'text-[var(--ink)] hover:bg-[var(--card)]'
                  }`}
                >
                  Señas en imagen
                </button>
              </div>
            )}
          </div>
          {question?.clue && (
            <div className="bg-[var(--accent-soft)]/55 border border-[var(--accent)]/30 rounded-xl px-3.5 py-2.5 mb-3">
              <p className="text-base sm:text-xl text-[var(--ink)] leading-snug font-bold m-0">
                {question.clue}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {options.map((optId, idx) => {
              const optWord = WORD_MAP[optId];
              const letter = 'ABCD'[idx];
              const isSelectedOpt = selected === optId;
              const isTargetOpt = optId === wordId;

              let borderStyle =
                'border-[var(--line)] hover:border-[var(--hl)] hover:shadow-md';
              if (answered) {
                if (isSelectedOpt) {
                  borderStyle = isCorrect
                    ? 'border-[var(--good)] ring-3 ring-[var(--good)]'
                    : 'border-[var(--accent)] ring-3 ring-[var(--accent)]';
                } else if (!isCorrect && isTargetOpt) {
                  borderStyle = 'border-[var(--good)] ring-2 ring-[var(--good)]';
                } else {
                  borderStyle = 'opacity-40 border-[var(--line)]';
                }
              }

              const hasVideo = Boolean(videos[optId]);
              const showVideo = hasVideo && optionMode === 'video';

              return (
                <button
                  key={`opt-${optId}`}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelect(optId)}
                  aria-label={`Opción ${letter}: ${optWord?.w || optId}`}
                  className={`relative bg-[var(--imgbg)] border-3 rounded-xl p-1 aspect-square flex gap-1 overflow-hidden transition-all text-left cursor-pointer disabled:cursor-default ${borderStyle}`}
                >
                  <span className="absolute top-1 left-1 z-10 w-6 h-6 rounded-full bg-[var(--line)] text-[var(--paper)] font-hand font-bold text-sm flex items-center justify-center shadow-xs">
                    {letter}
                  </span>

                  {showVideo ? (
                    <div className="relative w-full h-full bg-[#F4F5F7] dark:bg-[#1D2025] rounded-lg overflow-hidden flex items-center justify-center">
                      <video
                        src={videos[optId]}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-1 right-1 bg-black/65 text-white font-body text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Video
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex gap-1">
                      {optWord?.img.map((imgName, imgIdx) => (
                        <div
                          key={`img-${imgIdx}`}
                          className="relative flex-1 h-full min-w-0 bg-white flex items-center justify-center"
                        >
                          <img
                            src={getSignImageUrl(imgName)}
                            alt={optWord.w}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                          {optWord.img.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/60 text-white font-hand text-xs px-1.5 py-0.5 rounded font-bold">
                              {imgIdx + 1}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {answered && (isSelectedOpt || isTargetOpt) && (
                    <span
                      className={`absolute inset-x-0 bottom-0 text-white font-hand text-base sm:text-lg text-center py-0.5 font-bold z-10 ${
                        isTargetOpt ? 'bg-[var(--good)]' : 'bg-[var(--accent)]'
                      }`}
                    >
                      {optWord?.w}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-3 flex flex-col gap-2">
              <div
                className={`font-bold text-sm sm:text-base ${
                  isCorrect ? 'text-[var(--good)]' : 'text-[var(--accent)]'
                }`}
              >
                {isCorrect
                  ? `¡Correcto! Es «${targetWord?.w}». +2 puntos y el retrato se completa.`
                  : `Esa no es la seña. -1 punto. La respuesta correcta era «${targetWord?.w}».`}
              </div>

              {targetWord?.sentence && (
                <div className="bg-[var(--paper)] border border-[var(--line)]/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-[var(--muted)] block text-[11px] uppercase tracking-wider mb-0.5">
                    Ejemplo en frase
                  </span>
                  <span className="text-[var(--ink)] font-semibold">
                    «{targetWord.sentence}»
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[var(--line)] text-[var(--paper)] hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  {gameState.n > 1 && !isCorrect ? 'Pasar el turno' : 'Continuar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
