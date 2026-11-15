import React from 'react';
import {
  FREE_SIGN_SQUARES,
  LADDERS,
  SNAKES,
  SQUARE_TO_WORD,
  WORD_MAP,
  getSignImageUrl,
} from '../data/familyData';
import { GameState } from '../types';

const BOARD_X = 30;
const BOARD_Y = 130;
const CELL_SIZE = 70;

function getGridPosition(square: number) {
  const zeroIdx = square - 1;
  const row = Math.floor(zeroIdx / 6);
  const colRaw = zeroIdx % 6;
  return {
    r: row,
    c: row % 2 === 0 ? colRaw : 5 - colRaw,
  };
}

function getCellTopLeft(square: number) {
  const { r, c } = getGridPosition(square);
  return {
    x: BOARD_X + c * CELL_SIZE,
    y: BOARD_Y + (5 - r) * CELL_SIZE,
  };
}

function getCellCenter(square: number) {
  const topLeft = getCellTopLeft(square);
  return {
    x: topLeft.x + CELL_SIZE / 2,
    y: topLeft.y + CELL_SIZE / 2,
  };
}

const TOKEN_FILLS = ['var(--t1)', 'var(--t2)', 'var(--t3)', 'var(--t4)'];
const TOKEN_OFFSETS: [number, number][] = [
  [-15, -14],
  [15, -14],
  [-15, 16],
  [15, 16],
];

interface HouseBoardProps {
  gameState: GameState;
  bouncingPawn: boolean;
}

export const HouseBoard: React.FC<HouseBoardProps> = ({
  gameState,
  bouncingPawn,
}) => {
  const { n, pos, turn, done, tried, last } = gameState;

  let innerGridLines = '';
  for (let i = 1; i < 6; i++) {
    innerGridLines += `M${BOARD_X + i * CELL_SIZE} ${BOARD_Y}V550 `;
  }
  for (let i = 1; i < 6; i++) {
    if (i % 2) {
      innerGridLines += `M${BOARD_X} ${BOARD_Y + i * CELL_SIZE}H450 `;
    }
  }

  const ladderPaths = Object.entries(LADDERS).map(([fromStr, toNum]) => {
    const start = getCellCenter(Number(fromStr));
    const end = getCellCenter(toNum);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);
    const ox = (-dy / len) * 9;
    const oy = (dx / len) * 9;
    let d = `M${start.x + ox} ${start.y + oy}L${end.x + ox} ${end.y + oy}M${start.x - ox} ${start.y - oy}L${end.x - ox} ${end.y - oy}`;
    const rungs = Math.round(len / 18);
    for (let i = 1; i < rungs; i++) {
      const t = i / rungs;
      const rx = start.x + dx * t;
      const ry = start.y + dy * t;
      d += `M${rx + ox} ${ry + oy}L${rx - ox} ${ry - oy}`;
    }
    return { key: fromStr, d };
  });

  const snakePaths = Object.entries(SNAKES).map(([fromStr, toNum]) => {
    const start = getCellCenter(Number(fromStr));
    const end = getCellCenter(toNum);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    let d = '';
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const wave = Math.sin(t * Math.PI * 3) * 12 * (1 - t * 0.5);
      d +=
        (i ? 'L' : 'M') +
        (start.x + dx * t + nx * wave).toFixed(1) +
        ' ' +
        (start.y + dy * t + ny * wave).toFixed(1);
    }
    return { key: fromStr, d, headX: start.x, headY: start.y };
  });

  return (
    <div className="w-full bg-[var(--card)] rounded-2xl p-3 shadow-md border-2 border-[var(--line)]/15">
      <svg
        id="house"
        viewBox="0 0 480 560"
        role="img"
        aria-label="Tablero de serpientes y escaleras en forma de casa"
        className="block w-full h-auto select-none"
      >
        <defs>
          {Array.from({ length: 36 }, (_, idx) => idx + 1).map((sq) => {
            const { x, y } = getCellTopLeft(sq);
            return (
              <clipPath key={`clip-${sq}`} id={`pc${sq}`}>
                <rect x={x + 15} y={y + 18} width={40} height={44} rx={3} />
              </clipPath>
            );
          })}
        </defs>

        {/* Roof & Chimney */}
        <path className="ink" d="M10 134 L240 22 L470 134" />
        <path className="ink" d="M362 82V50H392V97" />
        <text
          className="lbl font-hand"
          x={240}
          y={104}
          style={{ fontSize: '24px' }}
        >
          Casa de la Familia
        </text>

        {/* 36 Cells */}
        {Array.from({ length: 36 }, (_, idx) => idx + 1).map((sq) => {
          const { x, y } = getCellTopLeft(sq);
          const wordId = SQUARE_TO_WORD[sq];
          const isGoal = sq === 36;
          const isFree = FREE_SIGN_SQUARES.includes(sq);
          const cellClass = isGoal
            ? 'cell goal'
            : isFree
              ? 'cell free'
              : 'cell';
          const isDone = Boolean(wordId && done[wordId] !== undefined);
          const isTried = Boolean(wordId && tried[wordId] && !isDone);
          const wordItem = wordId ? WORD_MAP[wordId] : null;

          return (
            <g key={`cell-${sq}`}>
              <rect
                className={cellClass}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
              />
              <text className="cnum" x={x + 5} y={y + 15}>
                {sq}
              </text>

              {sq === 1 && (
                <text
                  className="lbl font-hand font-bold"
                  x={x + CELL_SIZE / 2}
                  y={y + 44}
                >
                  SALIDA
                </text>
              )}

              {isGoal && (
                <text
                  className="lbl big font-hand"
                  x={x + CELL_SIZE / 2}
                  y={y + 46}
                >
                  META
                </text>
              )}

              {isFree && (
                <>
                  <text
                    className="lbl font-hand"
                    x={x + CELL_SIZE / 2}
                    y={y + 40}
                    style={{ fontSize: '24px' }}
                  >
                    ✋
                  </text>
                  <text
                    className="freeic font-hand font-bold"
                    x={x + CELL_SIZE / 2}
                    y={y + 60}
                  >
                    seña libre
                  </text>
                </>
              )}

              {wordId && wordItem && (
                <g
                  className={`port ${isDone ? 'done' : ''} ${isTried ? 'tried' : ''}`}
                >
                  <rect
                    className="pf"
                    x={x + 12}
                    y={y + 15}
                    width={46}
                    height={50}
                    rx={4}
                  />
                  {isDone ? (
                    <image
                      href={getSignImageUrl(
                        wordItem.img[wordItem.img.length - 1]
                      )}
                      x={x + 15}
                      y={y + 18}
                      width={40}
                      height={44}
                      preserveAspectRatio="xMidYMin slice"
                      clipPath={`url(#pc${sq})`}
                    />
                  ) : (
                    <text
                      className="pq"
                      x={x + 15 + 20}
                      y={y + 18 + 22}
                    >
                      ?
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Inner Grid & Floor Lines & Outer Frame */}
        <path className="ink thin" d={innerGridLines} />
        <path className="ink" d={`M${BOARD_X} 270H450 M${BOARD_X} 410H450`} />
        <rect
          className="ink"
          x={BOARD_X}
          y={BOARD_Y}
          width={420}
          height={420}
          rx={2}
        />

        {/* Entry Arrow */}
        <path className="ink" d="M2 515H24 M14 506L24 515L14 524" />

        {/* Ladders */}
        {ladderPaths.map(({ key, d }) => (
          <path key={`ladder-${key}`} className="ladder" d={d} />
        ))}

        {/* Snakes */}
        {snakePaths.map(({ key, d, headX, headY }) => (
          <g key={`snake-${key}`}>
            <path className="snake" d={d} />
            <circle className="snakehead" cx={headX} cy={headY} r={9} />
            <circle
              className="snakeeye"
              cx={headX - 3}
              cy={headY - 2}
              r={2}
            />
            <circle
              className="snakeeye"
              cx={headX + 3}
              cy={headY - 2}
              r={2}
            />
          </g>
        ))}

        {/* Highlighted Last Square */}
        {last && (
          <rect
            className="landed"
            x={getCellTopLeft(last).x + 3}
            y={getCellTopLeft(last).y + 3}
            width={64}
            height={64}
            rx={4}
          />
        )}

        {/* Team Pawns */}
        {Array.from({ length: n }, (_, idx) => {
          const center = getCellCenter(pos[idx]);
          const offset: [number, number] =
            n === 1 ? [0, 22] : TOKEN_OFFSETS[idx];
          const isActive = idx === turn;
          const shouldBounce = isActive && bouncingPawn;
          return (
            <circle
              key={`tok-${idx}`}
              id={`tok${idx}`}
              className={`tok ${isActive ? 'active' : ''} ${shouldBounce ? 'bounce' : ''}`}
              cx={center.x + offset[0]}
              cy={center.y + offset[1]}
              r={isActive ? 11 : 8.5}
              style={{
                fill: TOKEN_FILLS[idx],
                transformOrigin: `${center.x + offset[0]}px ${center.y + offset[1]}px`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
