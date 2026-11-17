import { useEffect, useRef, useState } from 'react';
import { FamilyTree } from './components/FamilyTree';
import { HouseBoard } from './components/HouseBoard';
import { QuestionModal } from './components/QuestionModal';
import { VictoryModal } from './components/VictoryModal';
import { VocabularyView } from './components/VocabularyView';
import {
  BACK_ONE_SQUARES,
  BONUS_TWO_SQUARES,
  DEFAULT_POOL,
  DEFAULT_SIGN_VIDEOS,
  DIE_PIPS,
  LADDERS,
  QUESTIONS,
  SNAKES,
  SQUARE_TO_WORD,
  TEAM_COLOR_VARS,
} from './data/familyData';
import { GameState, ViewMode } from './types';
import { soundEffects } from './utils/audio';
import { loadCustomVideos } from './utils/videoDb';

const STORAGE_KEY = 'casaFamiliaState';

function createInitialState(teamCount = 2): GameState {
  return {
    n: teamCount,
    pts: Array(teamCount).fill(0),
    pos: Array(teamCount).fill(1),
    turn: 0,
    done: {},
    tried: {},
    last: null,
    mark: null,
    ended: false,
  };
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const [view, setView] = useState<ViewMode>('VOCABULARIO');
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        if (parsed && parsed.n && Array.isArray(parsed.pos)) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return createInitialState(2);
  });

  const [dieFace, setDieFace] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bouncingPawn, setBouncingPawn] = useState(false);

  const [questionWordId, setQuestionWordId] = useState<string | null>(null);
  const [modalSquare, setModalSquare] = useState(0);
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const [videos, setVideos] = useState<Record<string, string>>(DEFAULT_SIGN_VIDEOS);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch {
      // ignore storage errors
    }
  }, [gameState]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    let active = true;
    loadCustomVideos().then((loaded) => {
      if (active && Object.keys(loaded).length > 0) {
        setVideos({ ...DEFAULT_SIGN_VIDEOS, ...loaded });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const buildOptions = (wordId: string): string[] => {
    const q = QUESTIONS[wordId];
    const must = q.must || [];
    const pool = [...(q.pool || DEFAULT_POOL)]
      .filter((id) => id !== wordId && !must.includes(id))
      .sort(() => 0.5 - Math.random());
    const needed = Math.max(0, 3 - must.length);

    let distractors = pool.slice(0, needed);
    const currentSet = [wordId, ...must, ...distractors];
    const hasVideo = currentSet.some((id) => Boolean(videos[id]));
    const hasImage = currentSet.some((id) => !videos[id]);

    if (!hasVideo) {
      const videoCandidate = pool.find((id) => Boolean(videos[id]));
      if (videoCandidate && distractors.length > 0) {
        distractors = [videoCandidate, ...distractors.slice(0, needed - 1)];
      }
    } else if (!hasImage) {
      const imageCandidate = pool.find((id) => !videos[id]);
      if (imageCandidate && distractors.length > 0) {
        distractors = [imageCandidate, ...distractors.slice(0, needed - 1)];
      }
    }

    return [wordId, ...must, ...distractors].sort(() => 0.5 - Math.random());
  };

  const advanceTurn = () => {
    setGameState((prev) => ({
      ...prev,
      mark: null,
      turn: prev.n > 1 ? (prev.turn + 1) % prev.n : 0,
    }));
    setBusy(false);
  };

  const handleRollDice = async () => {
    if (
      busy ||
      rolling ||
      gameState.ended ||
      questionWordId
    ) {
      return;
    }

    setBusy(true);
    setRolling(true);
    soundEffects.playDiceRoll(audioEnabled);

    for (let i = 0; i < 7; i++) {
      setDieFace(Math.floor(Math.random() * 6) + 1);
      await delay(75);
    }

    const rolled = Math.floor(Math.random() * 6) + 1;
    setDieFace(rolled);
    setRolling(false);

    const activeTurn = gameState.turn;
    let currentPos = gameState.pos[activeTurn];

    for (let step = 0; step < rolled && currentPos < 36; step++) {
      currentPos++;
      const nextSquare = currentPos;
      setGameState((prev) => {
        const nextPos = [...prev.pos];
        nextPos[activeTurn] = nextSquare;
        return { ...prev, pos: nextPos, last: nextSquare };
      });
      soundEffects.playStep(audioEnabled);
      await delay(220);
    }

    setBouncingPawn(true);
    setTimeout(() => setBouncingPawn(false), 600);

    let landedSquare = currentPos;

    const applySnakesAndLadders = async (square: number): Promise<number> => {
      if (LADDERS[square]) {
        const target = LADDERS[square];
        showToast(`¡Escalera! Sube de ${square} a ${target}`);
        soundEffects.playLadder(audioEnabled);
        await delay(650);
        setGameState((prev) => {
          const nextPos = [...prev.pos];
          nextPos[activeTurn] = target;
          return { ...prev, pos: nextPos, last: target };
        });
        setBouncingPawn(true);
        setTimeout(() => setBouncingPawn(false), 600);
        await delay(500);
        return target;
      }

      if (SNAKES[square]) {
        const target = SNAKES[square];
        showToast(`¡Serpiente! Baja de ${square} a ${target}`);
        soundEffects.playSnake(audioEnabled);
        await delay(650);
        setGameState((prev) => {
          const nextPos = [...prev.pos];
          nextPos[activeTurn] = target;
          return { ...prev, pos: nextPos, last: target };
        });
        setBouncingPawn(true);
        setTimeout(() => setBouncingPawn(false), 600);
        await delay(500);
        return target;
      }

      return square;
    };

    landedSquare = await applySnakesAndLadders(landedSquare);

    if (BONUS_TWO_SQUARES.includes(landedSquare) && landedSquare < 36) {
      showToast('¡Casilla +2! Avanzas 2 casillas');
      soundEffects.playLadder(audioEnabled);
      await delay(550);
      for (let extra = 0; extra < 2 && landedSquare < 36; extra++) {
        landedSquare++;
        const nextBonusSquare = landedSquare;
        setGameState((prev) => {
          const nextPos = [...prev.pos];
          nextPos[activeTurn] = nextBonusSquare;
          return { ...prev, pos: nextPos, last: nextBonusSquare };
        });
        soundEffects.playStep(audioEnabled);
        await delay(220);
      }
      setBouncingPawn(true);
      setTimeout(() => setBouncingPawn(false), 600);
      await delay(400);
      landedSquare = await applySnakesAndLadders(landedSquare);
    } else if (BACK_ONE_SQUARES.includes(landedSquare) && landedSquare > 1) {
      showToast('¡Retrocede 1! Vuelves 1 casilla');
      soundEffects.playSnake(audioEnabled);
      await delay(550);
      landedSquare = Math.max(1, landedSquare - 1);
      setGameState((prev) => {
        const nextPos = [...prev.pos];
        nextPos[activeTurn] = landedSquare;
        return { ...prev, pos: nextPos, last: landedSquare };
      });
      soundEffects.playStep(audioEnabled);
      setBouncingPawn(true);
      setTimeout(() => setBouncingPawn(false), 600);
      await delay(400);
      landedSquare = await applySnakesAndLadders(landedSquare);
    }

    if (landedSquare >= 36) {
      soundEffects.playVictory(audioEnabled);
      setGameState((prev) => {
        const nextPts = [...prev.pts];
        nextPts[activeTurn] += 3;
        return { ...prev, pts: nextPts, ended: true };
      });
      setBusy(false);
      setShowVictoryModal(true);
      return;
    }

    const wordId = SQUARE_TO_WORD[landedSquare];
    if (wordId && gameState.done[wordId] === undefined) {
      const opts = buildOptions(wordId);
      setModalSquare(landedSquare);
      setQuestionOptions(opts);
      setQuestionWordId(wordId);
      setGameState((prev) => ({ ...prev, mark: QUESTIONS[wordId].t }));
      setBusy(false);
    } else {
      if (wordId) {
        showToast('Este retrato ya está completo. Pasa el turno.');
      }
      setBusy(false);
      await delay(wordId ? 900 : 250);
      advanceTurn();
    }
  };

  const handleAnswer = (selectedId: string) => {
    if (!questionWordId) return;
    const isCorrect = selectedId === questionWordId;
    const activeTurn = gameState.turn;

    if (isCorrect) {
      soundEffects.playSuccess(audioEnabled);
      setGameState((prev) => {
        const nextPts = [...prev.pts];
        nextPts[activeTurn] += 2;
        return {
          ...prev,
          pts: nextPts,
          done: { ...prev.done, [questionWordId]: activeTurn },
        };
      });
    } else {
      soundEffects.playWrong(audioEnabled);
      setGameState((prev) => {
        const nextPts = [...prev.pts];
        nextPts[activeTurn] -= 1;
        return {
          ...prev,
          pts: nextPts,
          tried: { ...prev.tried, [questionWordId]: true },
        };
      });
    }
  };

  const handleCloseQuestion = () => {
    setQuestionWordId(null);
    advanceTurn();
  };

  const handleTeamCountChange = (count: number) => {
    if (count === gameState.n || busy) return;
    if (
      gameState.pos.some((p) => p > 1) ||
      Object.keys(gameState.done).length > 0
    ) {
      showToast('Reinicia el juego para cambiar el número de equipos.');
      return;
    }
    setGameState(createInitialState(count));
  };

  const handleResetGame = () => {
    setGameState(createInitialState(gameState.n));
    setConfirmReset(false);
    setQuestionWordId(null);
    setShowVictoryModal(false);
    setBusy(false);
    showToast('Juego reiniciado');
  };

  const getTeamLabel = (idx: number) =>
    gameState.n === 1 ? 'Jugador' : `Equipo ${idx + 1}`;

  if (view === 'VOCABULARIO') {
    return (
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4">
          <div className="bg-[var(--accent-soft)]/55 border-2 border-[var(--accent)]/30 rounded-xl px-4 py-2.5 text-sm sm:text-base font-bold text-[var(--ink)]">
            <span className="text-[var(--accent)] uppercase tracking-wider text-xs font-extrabold mr-2">
              Paso 1 de 2
            </span>
            Estudia las 22 señas del vocabulario de la familia. Cuando termines,
            pulsa «¡A jugar en la casa!» para empezar el juego.
          </div>
        </div>
        <VocabularyView
          videos={videos}
          onStartPlaying={() => setView('JUEGO')}
          onBackToHome={() => setView('JUEGO')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] py-5 px-3 sm:px-6 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6">
        <header className="flex flex-wrap gap-4 items-end justify-between border-b-2 border-[var(--line)]/20 pb-4">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest font-extrabold text-[var(--muted)]">
              Lengua de señas · Juego didáctico de la familia
            </div>
            <h1 className="font-hand text-4xl sm:text-6xl text-[var(--ink)] leading-none mt-1">
              Entre{' '}
              <span className="text-[var(--accent)]">Señas y Escaleras</span>
              : La Casa Familiar
            </h1>
            <div className="mt-2.5 text-xs sm:text-sm text-[var(--ink)]/85 leading-snug">
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-[var(--accent)] block mb-0.5">
                Integrantes
              </span>
              <p className="m-0 font-semibold text-[var(--ink)]">
                Angie Michelle Amézquita Luna · Nivaldo de Jesús Castilla Davila
                · Diego Andrés Barrios · Felipe Jaramillo Tatis · Josué Daniel
                Olivares Mora
              </p>
            </div>
            <p className="text-[var(--muted)] text-sm sm:text-base mt-2.5 leading-relaxed">
              Serpientes y escaleras dentro de la casa. Lanza el dado, sube por
              las escaleras, evita las serpientes y, cuando caigas en un{' '}
              <b className="text-[var(--ink)]">retrato</b>, observa el{' '}
              <b className="text-[var(--accent)]">árbol familiar y la pista</b>{' '}
              para elegir la seña correcta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--muted)] font-bold">
                Equipos:
              </span>
              <div
                className="inline-flex border-2 border-[var(--line)] rounded-xl overflow-hidden bg-[var(--card)] shadow-xs"
                role="group"
                aria-label="Número de equipos"
              >
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={`teams-${count}`}
                    type="button"
                    onClick={() => handleTeamCountChange(count)}
                    className={`px-3 py-1 font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                      gameState.n === count
                        ? 'bg-[var(--line)] text-[var(--paper)]'
                        : 'bg-transparent text-[var(--ink)] hover:bg-[var(--line)]/10'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView('VOCABULARIO')}
              className="px-3 py-1.5 rounded-xl border-2 border-[var(--line)] bg-[var(--card)] text-xs sm:text-sm font-bold text-[var(--ink)] hover:bg-[var(--line)]/10 cursor-pointer transition-all shadow-xs"
            >
              Estudiar señas
            </button>

            <button
              type="button"
              onClick={() => setAudioEnabled((prev) => !prev)}
              aria-label={audioEnabled ? 'Silenciar sonido' : 'Activar sonido'}
              className="px-3 py-1.5 rounded-xl border-2 border-[var(--line)] bg-[var(--card)] text-xs sm:text-sm font-bold text-[var(--ink)] hover:bg-[var(--line)]/10 cursor-pointer transition-all shadow-xs"
            >
              {audioEnabled ? 'Audio: ON' : 'Audio: OFF'}
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Cambiar tema"
              className="px-3 py-1.5 rounded-xl border-2 border-[var(--line)] bg-[var(--card)] text-xs sm:text-sm font-bold text-[var(--ink)] hover:bg-[var(--line)]/10 cursor-pointer transition-all shadow-xs"
            >
              {darkMode ? 'Tema claro' : 'Tema oscuro'}
            </button>

            {confirmReset ? (
              <span className="inline-flex items-center gap-2 font-bold text-xs bg-[var(--card)] p-1.5 rounded-xl border-2 border-[var(--accent)]">
                ¿Borrar progreso?
                <button
                  type="button"
                  onClick={handleResetGame}
                  className="px-2 py-0.5 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 font-bold cursor-pointer"
                >
                  Sí, reiniciar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper)] font-bold cursor-pointer"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-xl border-2 border-[var(--line)] bg-transparent text-xs sm:text-sm font-bold text-[var(--ink)] hover:bg-[var(--card)] cursor-pointer transition-all shadow-xs"
              >
                Reiniciar juego
              </button>
            )}
          </div>
        </header>

        <details className="bg-[var(--card)] border-2 border-[var(--line)]/15 rounded-2xl p-4 sm:p-5 shadow-xs">
          <summary className="cursor-pointer list-none flex items-center justify-between font-hand text-2xl text-[var(--ink)] select-none">
            <span className="flex items-center gap-2">
              Reglas del juego y puntuación
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-[var(--muted)] font-body">
              (toca para abrir / cerrar)
            </span>
          </summary>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-4 pt-3 border-t border-[var(--line)]/15 text-xs sm:text-sm leading-relaxed">
            <section className="flex flex-col gap-1.5">
              <h3 className="font-hand text-xl text-[var(--accent)] font-normal m-0">
                Objetivo
              </h3>
              <p>
                Recorrer la casa desde la <b>SALIDA</b> (casilla 1) hasta la{' '}
                <b>META</b> (casilla 36) y completar los{' '}
                <b>22 retratos familiares</b> respondiendo las preguntas. Si
                juegan varios equipos, gana quien sume más puntos al llegar a la
                meta.
              </p>
              <h3 className="font-hand text-xl text-[var(--accent)] font-normal mt-2 m-0">
                Preparación
              </h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Pueden jugar de <b>1 jugador</b> hasta <b>4 equipos</b>. Todos
                  empiezan en la casilla 1.
                </li>
                <li>
                  Todo el juego se desarrolla de forma <b>100 % virtual</b>: en
                  cada turno el participante lanza el dado y responde
                  directamente en pantalla.
                </li>
                <li>
                  El juego comienza con la <b>presentación del vocabulario</b>
                  (22 señas). Durante la partida pueden volver a repasarlas en{' '}
                  <b>«Estudiar señas»</b>.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-1.5">
              <h3 className="font-hand text-xl text-[var(--accent)] font-normal m-0">
                Cómo se juega
              </h3>
              <ol className="list-decimal pl-4 space-y-1">
                <li>El jugador o equipo en turno lanza el dado y avanza.</li>
                <li>
                  <b>3 escaleras y 4 serpientes:</b> si cae al pie de una
                  escalera, sube; si cae en la cabeza de una serpiente, baja a
                  la cola.
                </li>
                <li>
                  <b>Casilla +2 y Retrocede -1:</b> en <b>+2</b> avanzas 2
                  casillas extra; en <b>-1</b> retrocedes 1 casilla.
                </li>
                <li>
                  <b>Retrato:</b> lee la descripción y observa en el árbol (a
                  partir de <b>«Soy yo»</b>) la <b>flecha roja</b> o el{' '}
                  <b>marco rojo de familia</b>. Luego elige entre 4 opciones (en
                  video o imagen).
                </li>
                <li>
                  Si acierta, suma <b>+2 puntos</b>, completa el retrato y ve un
                  ejemplo en frase.
                </li>
                <li>
                  Si falla, resta <b>-1 punto</b> y pasa el turno al siguiente
                  equipo (si ese retrato ya estaba completo, solo pasa el turno).
                </li>
              </ol>
            </section>

            <section className="flex flex-col gap-1.5">
              <h3 className="font-hand text-xl text-[var(--accent)] font-normal m-0">
                Puntuación
              </h3>
              <table className="w-full text-xs sm:text-sm font-semibold">
                <tbody>
                  <tr className="border-b border-dashed border-[var(--line)]/25">
                    <td className="py-1">Elegir la seña correcta</td>
                    <td className="py-1 text-right font-hand text-xl font-bold text-[var(--good)] tabular-nums">
                      +2
                    </td>
                  </tr>
                  <tr className="border-b border-dashed border-[var(--line)]/25">
                    <td className="py-1">Llegar primero a la META</td>
                    <td className="py-1 text-right font-hand text-xl font-bold text-[var(--accent)] tabular-nums">
                      +3
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Respuesta equivocada</td>
                    <td className="py-1 text-right font-hand text-xl font-bold text-[var(--accent)] tabular-nums">
                      -1
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)] mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[var(--house-room)] border border-[var(--house-outline)]" />
                  Retrato
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[var(--house-free)] border border-[var(--house-outline)]" />
                  Casilla +2
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[var(--house-back)] border border-[var(--house-outline)]" />
                  Retrocede -1
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[var(--house-wood)] border border-[var(--house-outline)]" />
                  Escalera
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[var(--house-snake)] border border-[var(--house-outline)]" />
                  Serpiente
                </span>
              </div>
            </section>
          </div>
        </details>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-[var(--card)] p-3 sm:p-4 rounded-2xl border-2 border-[var(--line)]/15 shadow-sm">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {Array.from({ length: gameState.n }, (_, idx) => {
              const isActive = idx === gameState.turn && !gameState.ended;
              return (
                <div
                  key={`team-badge-${idx}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 transition-all min-w-[140px] flex-1 sm:flex-initial ${
                    isActive
                      ? 'border-[var(--line)] shadow-md bg-[var(--paper)] ring-2 ring-[var(--accent)]/30'
                      : 'border-transparent bg-[var(--paper)]/60'
                  }`}
                  style={{
                    borderLeftColor: `var(${TEAM_COLOR_VARS[idx]})`,
                    borderLeftWidth: '5px',
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-[var(--line)]"
                    style={{ background: `var(${TEAM_COLOR_VARS[idx]})` }}
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm leading-tight">
                      {getTeamLabel(idx)}
                    </div>
                    <div className="text-[11px] text-[var(--muted)] tabular-nums">
                      Casilla {gameState.pos[idx]}
                      {isActive && gameState.n > 1 ? ' · en turno' : ''}
                    </div>
                  </div>
                  <span className="ml-auto font-hand text-2xl font-bold text-[var(--ink)] tabular-nums">
                    {gameState.pts[idx]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div
              className={`die-cube shadow-xs ${rolling ? 'rolling' : ''}`}
              aria-label={`Dado: ${dieFace}`}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((pipIdx) => (
                <i
                  key={`pip-${pipIdx}`}
                  className={DIE_PIPS[dieFace]?.includes(pipIdx) ? 'on' : ''}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleRollDice}
              disabled={busy || rolling || gameState.ended}
              className="px-5 py-3 rounded-xl bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 text-white font-hand font-bold text-xl sm:text-2xl shadow-md transition-all cursor-pointer disabled:cursor-not-allowed leading-none"
            >
              {gameState.ended
                ? 'Juego terminado'
                : `Lanzar dado${
                    gameState.n > 1 ? ` · ${getTeamLabel(gameState.turn)}` : ''
                  }`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-5 sm:gap-6 items-start">
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <h2 className="font-hand text-2xl sm:text-3xl font-normal text-[var(--ink)] m-0">
                La casa
              </h2>
              <span className="text-xs sm:text-sm text-[var(--muted)] font-bold tabular-nums">
                {Object.keys(gameState.done).length} / 22 retratos completos
              </span>
            </div>
            <HouseBoard gameState={gameState} bouncingPawn={bouncingPawn} />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <h2 className="font-hand text-2xl sm:text-3xl font-normal text-[var(--ink)] m-0">
                Mi árbol genealógico
              </h2>
              <span className="text-xs sm:text-sm text-[var(--accent)] font-bold">
                La flecha roja marca la pregunta
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-[var(--ink)] min-h-[1.5em] px-1">
              {gameState.ended
                ? '¡Juego terminado!'
                : gameState.mark
                  ? 'Pregunta en curso: mira la flecha roja en el árbol.'
                  : `${
                      gameState.n > 1
                        ? `${getTeamLabel(gameState.turn)}: `
                        : ''
                    }lanza el dado para avanzar.`}
            </div>
            <div className="w-full bg-[var(--card)] rounded-2xl p-3 shadow-md border-2 border-[var(--line)]/15 overflow-x-auto">
              <div className="min-w-[540px]">
                <FamilyTree
                  target={gameState.mark}
                  crop={false}
                  gameState={gameState}
                  idPrefix="main"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {questionWordId && (
        <QuestionModal
          wordId={questionWordId}
          squareNumber={modalSquare}
          options={questionOptions}
          gameState={gameState}
          videos={videos}
          onAnswer={handleAnswer}
          onClose={handleCloseQuestion}
        />
      )}

      {showVictoryModal && (
        <VictoryModal
          gameState={gameState}
          onPlayAgain={handleResetGame}
          onClose={() => setShowVictoryModal(false)}
        />
      )}

      {toast && (
        <div className="fixed left-1/2 bottom-5 -translate-x-1/2 bg-[var(--line)] text-[var(--paper)] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl z-50 text-center animate-pop">
          {toast}
        </div>
      )}
    </div>
  );
}
