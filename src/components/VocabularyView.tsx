import React, { useEffect, useState } from 'react';
import {
  SENTENCE_EXAMPLES,
  WORDS,
  WORD_MAP,
  getSignImageUrl,
} from '../data/familyData';

interface VocabularyViewProps {
  initialTab?: 'words' | 'sentences';
  videos: Record<string, string>;
  onStartPlaying: () => void;
  onBackToHome: () => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  initialTab = 'words',
  videos,
  onStartPlaying,
  onBackToHome,
}) => {
  const [tab, setTab] = useState<'words' | 'sentences'>(initialTab);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [showDrawingIds, setShowDrawingIds] = useState<Record<string, boolean>>(
    {}
  );
  const [filter, setFilter] = useState<'all' | 'simple' | 'double'>('all');
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(
    null
  );
  const [activeSignIdx, setActiveSignIdx] = useState<number>(0);

  const toggleCard = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDrawing = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();
    setShowDrawingIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealAll = () => setRevealedIds(WORDS.map((w) => w.id));
  const hideAll = () => setRevealedIds([]);

  const filteredWords = WORDS.filter((w) => {
    if (filter === 'double') return w.img.length > 1;
    if (filter === 'simple') return w.img.length === 1;
    return true;
  });

  const progressPct = Math.round((revealedIds.length / WORDS.length) * 100);

  useEffect(() => {
    if (!playingSentenceId) return;
    const sentence = SENTENCE_EXAMPLES.find((s) => s.id === playingSentenceId);
    if (!sentence) return;

    const timer = setInterval(() => {
      setActiveSignIdx((prev) => {
        if (prev + 1 >= sentence.signIds.length) {
          setPlayingSentenceId(null);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [playingSentenceId]);

  const handleTogglePlay = (sentenceId: string) => {
    if (playingSentenceId === sentenceId) {
      setPlayingSentenceId(null);
    } else {
      setActiveSignIdx(0);
      setPlayingSentenceId(sentenceId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--line)]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              ← Volver al tablero
            </button>
            <span className="text-xs text-[var(--muted)]">·</span>
            <span className="text-xs text-[var(--accent)] font-extrabold uppercase tracking-wider">
              Estudio de Vocabulario
            </span>
          </div>
          <h1 className="font-hand text-3xl sm:text-5xl font-normal text-[var(--ink)] m-0">
            Vocabulario de la Familia
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            {tab === 'words'
              ? 'Toca cada tarjeta para revelar la palabra, su frase de ejemplo y cómo realizar la seña (en video o ilustración).'
              : 'Combina varias señas y videos en frases cotidianas para entender mejor cada parentesco.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {tab === 'words' && (
            <div className="text-right hidden sm:block">
              <span className="text-xs text-[var(--muted)] block">
                Progreso de estudio
              </span>
              <span className="font-hand text-lg font-bold text-[var(--accent)] tabular-nums">
                {revealedIds.length} / {WORDS.length} descubiertas ({progressPct}
                %)
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={onStartPlaying}
            className="px-6 py-3 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white font-hand font-bold text-lg sm:text-xl shadow-md transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>¡A jugar en la casa!</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[var(--card)] p-3 rounded-xl border border-[var(--line)]/15">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--paper)] border border-[var(--line)]/15">
          <button
            type="button"
            onClick={() => setTab('words')}
            className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              tab === 'words'
                ? 'bg-[var(--line)] text-[var(--paper)] shadow-xs'
                : 'text-[var(--ink)] hover:bg-[var(--card)]'
            }`}
          >
            Palabras ({WORDS.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('sentences')}
            className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              tab === 'sentences'
                ? 'bg-[var(--line)] text-[var(--paper)] shadow-xs'
                : 'text-[var(--ink)] hover:bg-[var(--card)]'
            }`}
          >
            Frases con señas ({SENTENCE_EXAMPLES.length})
          </button>
        </div>

        {tab === 'words' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[var(--muted)] mr-1 hidden sm:inline font-bold">
                Filtrar:
              </span>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[var(--line)] text-[var(--paper)]'
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                Todas (22)
              </button>
              <button
                type="button"
                onClick={() => setFilter('simple')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === 'simple'
                    ? 'bg-[var(--line)] text-[var(--paper)]'
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                Seña simple (20)
              </button>
              <button
                type="button"
                onClick={() => setFilter('double')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === 'double'
                    ? 'bg-[var(--line)] text-[var(--paper)]'
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                Compuestas (2)
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={revealAll}
                className="px-2.5 py-1 text-[var(--muted)] hover:text-[var(--ink)] underline cursor-pointer"
              >
                Revelar todas
              </button>
              <span className="text-[var(--line)]/40">|</span>
              <button
                type="button"
                onClick={hideAll}
                className="px-2.5 py-1 text-[var(--muted)] hover:text-[var(--ink)] underline cursor-pointer"
              >
                Ocultar todas
              </button>
            </div>
          </div>
        )}
      </div>

      {tab === 'words' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredWords.map((word) => {
            const isRevealed = revealedIds.includes(word.id);
            const isDouble = word.img.length > 1;
            const hasVideo = Boolean(videos[word.id]);
            const showDrawing = Boolean(showDrawingIds[word.id]);

            return (
              <div
                key={`card-${word.id}`}
                role="button"
                tabIndex={0}
                onClick={() => toggleCard(word.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard(word.id);
                  }
                }}
                className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between text-left focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                  isRevealed
                    ? 'bg-[var(--card)] border-[var(--good)] shadow-md'
                    : 'bg-[var(--card)] border-[var(--line)]/25 hover:border-[var(--hl)] shadow-xs'
                }`}
              >
                <div className="px-3 pt-2.5 pb-1 flex items-center justify-between text-xs w-full gap-1">
                  <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider font-hand">
                    {hasVideo && !showDrawing
                      ? 'Video'
                      : isDouble
                        ? 'Seña Compuesta'
                        : 'Seña'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hasVideo && (
                      <button
                        type="button"
                        onClick={(e) => toggleDrawing(e, word.id)}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--paper)] border border-[var(--line)]/25 text-[var(--ink)] hover:border-[var(--line)] cursor-pointer"
                      >
                        {showDrawing ? 'Ver video' : 'Ver dibujo'}
                      </button>
                    )}
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isRevealed
                          ? 'bg-[var(--good)] text-white'
                          : 'bg-[var(--paper)] text-[var(--muted)] border border-[var(--line)]/30'
                      }`}
                    >
                      {isRevealed ? '✓' : '?'}
                    </span>
                  </div>
                </div>

                <div className="p-2 flex-1 flex flex-col items-center justify-center bg-[var(--imgbg)] mx-2 my-1 rounded-xl border border-[var(--line)]/15 w-[calc(100%-1rem)]">
                  {hasVideo && !showDrawing ? (
                    <div className="w-full aspect-square max-w-[140px] flex items-center justify-center overflow-hidden rounded-lg bg-[#F4F5F7] dark:bg-[#1D2025]">
                      <video
                        src={videos[word.id]}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : isDouble ? (
                    <div className="flex items-center gap-1.5 w-full">
                      {word.img.map((imgName, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-[var(--accent)] font-hand">
                            {idx === 0 ? '1' : '2'}
                          </span>
                          <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                            <img
                              src={getSignImageUrl(imgName)}
                              alt={
                                isRevealed ? `${word.w} paso ${idx + 1}` : 'Seña'
                              }
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full aspect-square max-w-[130px] flex items-center justify-center overflow-hidden">
                      <img
                        src={getSignImageUrl(word.img[0])}
                        alt={isRevealed ? word.w : 'Seña'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-[var(--paper)] border-t border-[var(--line)]/15 text-center min-h-[58px] flex flex-col items-center justify-center w-full gap-1">
                  {isRevealed ? (
                    <>
                      <span className="font-hand font-bold text-xl text-[var(--good)] leading-tight">
                        {word.w}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--ink)] leading-snug">
                        «{word.sentence}»
                      </span>
                      <span className="text-[10px] text-[var(--muted)] leading-snug">
                        {word.d}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-[var(--muted)] italic font-hand font-bold">
                      Toca para ver la palabra y frase
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {SENTENCE_EXAMPLES.map((sentence) => {
            const isPlaying = playingSentenceId === sentence.id;

            return (
              <div
                key={sentence.id}
                className="bg-[var(--card)] border-2 border-[var(--line)]/15 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[var(--muted)] font-bold">
                      {sentence.title} · {sentence.signIds.length} señas clave
                    </div>
                    <p className="font-hand text-2xl sm:text-[26px] leading-snug text-[var(--ink)] mt-1">
                      «
                      {sentence.tokens.map((tok, tIdx) => {
                        if (!tok.wordId) {
                          return <span key={tIdx}>{tok.text}</span>;
                        }
                        const signPos = sentence.signIds.indexOf(tok.wordId);
                        const isActiveToken =
                          isPlaying && signPos === activeSignIdx;
                        return (
                          <span
                            key={tIdx}
                            className={`underline decoration-2 underline-offset-4 transition-colors ${
                              isActiveToken
                                ? 'text-[var(--good)] decoration-[var(--good)]'
                                : 'text-[var(--accent)] decoration-[var(--accent)]/50'
                            }`}
                          >
                            {tok.text}
                          </span>
                        );
                      })}
                      »
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePlay(sentence.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isPlaying
                        ? 'bg-[var(--good)] text-white border-[var(--good)]'
                        : 'bg-[var(--paper)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--line)] hover:text-[var(--paper)]'
                    }`}
                  >
                    {isPlaying ? 'Detener' : 'Secuencia ▶'}
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {sentence.signIds.map((signId, idx) => {
                    const word = WORD_MAP[signId];
                    if (!word) return null;
                    const isHighlighted = isPlaying && idx === activeSignIdx;
                    const stepVideo = videos[signId];

                    return (
                      <div
                        key={`${sentence.id}-${signId}-${idx}`}
                        className={`rounded-xl border-2 p-2 bg-[var(--paper)] flex flex-col items-center gap-1.5 transition-all ${
                          isHighlighted
                            ? 'border-[var(--good)] ring-2 ring-[var(--good)]/40 scale-[1.03]'
                            : 'border-[var(--line)]/15'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between text-[11px] font-bold text-[var(--muted)]">
                          <span className="font-hand text-sm text-[var(--accent)]">
                            {idx + 1}.
                          </span>
                          <span className="truncate text-[var(--ink)] font-hand text-base">
                            {word.w}
                          </span>
                        </div>
                        <div className="w-full aspect-square bg-[var(--imgbg)] rounded-lg p-1 flex gap-1 items-center justify-center overflow-hidden border border-[var(--line)]/10">
                          {stepVideo ? (
                            <video
                              src={stepVideo}
                              muted
                              loop
                              autoPlay
                              playsInline
                              className="w-full h-full object-contain rounded"
                            />
                          ) : (
                            word.img.map((imgName, iIdx) => (
                              <img
                                key={iIdx}
                                src={getSignImageUrl(imgName)}
                                alt={word.w}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain flex-1 min-w-0"
                              />
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed m-0">
                  {sentence.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onStartPlaying}
          className="px-8 py-3.5 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white font-hand font-bold text-2xl shadow-lg transition-all cursor-pointer"
        >
          Ya he estudiado las señas, ¡comenzar el juego!
        </button>
      </div>
    </div>
  );
};
