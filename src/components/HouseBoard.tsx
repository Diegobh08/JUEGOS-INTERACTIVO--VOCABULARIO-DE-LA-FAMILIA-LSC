import React from 'react';
import {
  BONUS_TWO_SQUARES,
  LADDERS,
  SNAKES,
  SQUARE_TO_WORD,
  WORD_MAP,
  getSignImageUrl,
} from '../data/familyData';
import { GameState } from '../types';

const BOARD_X = 50;
const BOARD_Y = 148;
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

function renderRoomProp(sq: number, x: number, y: number) {
  switch (sq) {
    case 3:
      // Cozy sofa with pillow
      return (
        <g opacity={0.85} aria-hidden="true">
          <rect
            x={x + 14}
            y={y + 38}
            width={42}
            height={18}
            rx={5}
            fill="#E3BEB8"
            stroke="var(--house-outline)"
            strokeWidth={1.8}
          />
          <rect
            x={x + 11}
            y={y + 45}
            width={8}
            height={13}
            rx={3}
            fill="#D4A69E"
            stroke="var(--house-outline)"
            strokeWidth={1.6}
          />
          <rect
            x={x + 51}
            y={y + 45}
            width={8}
            height={13}
            rx={3}
            fill="#D4A69E"
            stroke="var(--house-outline)"
            strokeWidth={1.6}
          />
          <rect
            x={x + 20}
            y={y + 42}
            width={11}
            height={9}
            rx={2}
            fill="#FFF7EF"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
            transform={`rotate(-8 ${x + 25} ${y + 46})`}
          />
        </g>
      );

    case 8:
      // Mountain framed picture
      return (
        <g opacity={0.85} aria-hidden="true">
          <rect
            x={x + 18}
            y={y + 18}
            width={34}
            height={28}
            rx={3}
            fill="#F4E2C8"
            stroke="var(--house-wood)"
            strokeWidth={3}
          />
          <rect
            x={x + 21}
            y={y + 21}
            width={28}
            height={22}
            rx={1}
            fill="#FAF3E8"
            stroke="var(--house-outline)"
            strokeWidth={1.2}
          />
          <path
            d={`M${x + 22} ${y + 41} L${x + 30} ${y + 28} L${x + 37} ${y + 37} L${x + 42} ${y + 31} L${x + 48} ${y + 41} Z`}
            fill="#B58D67"
            opacity={0.75}
          />
        </g>
      );

    case 14:
      // Potted leafy plant
      return (
        <g opacity={0.88} aria-hidden="true">
          <path
            d={`M${x + 29} ${y + 44} H${x + 45} L${x + 42} ${y + 58} H${x + 32} Z`}
            fill="#C9876B"
            stroke="var(--house-outline)"
            strokeWidth={1.6}
          />
          <path
            d={`M${x + 37} ${y + 44} Q${x + 24} ${y + 32} ${x + 18} ${y + 37} Q${x + 26} ${y + 43} ${x + 37} ${y + 44} Z`}
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
          <path
            d={`M${x + 37} ${y + 44} Q${x + 37} ${y + 26} ${x + 34} ${y + 23} Q${x + 41} ${y + 32} ${x + 37} ${y + 44} Z`}
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
          <path
            d={`M${x + 37} ${y + 44} Q${x + 49} ${y + 31} ${x + 54} ${y + 36} Q${x + 47} ${y + 43} ${x + 37} ${y + 44} Z`}
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
        </g>
      );

    case 19:
      // Side table with warm glowing lamp
      return (
        <g opacity={0.9} aria-hidden="true">
          <rect
            x={x + 19}
            y={y + 45}
            width={32}
            height={5}
            rx={2}
            fill="var(--house-wood)"
            stroke="var(--house-outline)"
            strokeWidth={1.5}
          />
          <path
            d={`M${x + 24} ${y + 50} V${y + 60} M${x + 46} ${y + 50} V${y + 60}`}
            stroke="var(--house-outline)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <path
            d={`M${x + 35} ${y + 45} V${y + 35}`}
            stroke="var(--house-outline)"
            strokeWidth={2.2}
          />
          <path
            d={`M${x + 25} ${y + 36} L${x + 29} ${y + 22} H${x + 41} L${x + 45} ${y + 36} Z`}
            fill="#F9D57A"
            stroke="var(--house-outline)"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </g>
      );

    case 26:
      // Bookshelf with colorful books
      return (
        <g opacity={0.88} aria-hidden="true">
          <rect
            x={x + 15}
            y={y + 47}
            width={40}
            height={5}
            rx={1.5}
            fill="var(--house-wood)"
            stroke="var(--house-outline)"
            strokeWidth={1.5}
          />
          <path
            d={`M${x + 20} ${y + 52} V${y + 60} M${x + 50} ${y + 52} V${y + 60}`}
            stroke="var(--house-outline)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <rect
            x={x + 18}
            y={y + 27}
            width={7}
            height={20}
            rx={1}
            fill="#C97C7C"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
          <rect
            x={x + 25}
            y={y + 30}
            width={6}
            height={17}
            rx={1}
            fill="#88A9C3"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
          <rect
            x={x + 31}
            y={y + 25}
            width={7}
            height={22}
            rx={1}
            fill="#E3BD6B"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
          <rect
            x={x + 38}
            y={y + 31}
            width={6}
            height={16}
            rx={1}
            fill="#8FB38A"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
          <rect
            x={x + 44}
            y={y + 28}
            width={7}
            height={19}
            rx={1}
            fill="#B79BC4"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
        </g>
      );

    case 29:
      // Window with lavender curtains
      return (
        <g opacity={0.88} aria-hidden="true">
          <rect
            x={x + 18}
            y={y + 20}
            width={34}
            height={34}
            rx={3}
            fill="var(--house-glass)"
            stroke="var(--house-outline)"
            strokeWidth={1.8}
          />
          <path
            d={`M${x + 35} ${y + 20} V${y + 54} M${x + 18} ${y + 37} H${x + 52}`}
            stroke="var(--house-outline)"
            strokeWidth={1.4}
          />
          <path
            d={`M${x + 17} ${y + 20} H${x + 27} Q${x + 23} ${y + 38} ${x + 26} ${y + 54} H${x + 17} Z`}
            fill="#D8C2DF"
            stroke="var(--house-outline)"
            strokeWidth={1.4}
          />
          <path
            d={`M${x + 43} ${y + 20} H${x + 53} V${y + 54} H${x + 44} Q${x + 47} ${y + 38} ${x + 43} ${y + 20} Z`}
            fill="#D8C2DF"
            stroke="var(--house-outline)"
            strokeWidth={1.4}
          />
        </g>
      );

    case 34:
      // Wooden cabinet with plant
      return (
        <g opacity={0.88} aria-hidden="true">
          <rect
            x={x + 16}
            y={y + 39}
            width={38}
            height={21}
            rx={2}
            fill="var(--house-wood)"
            stroke="var(--house-outline)"
            strokeWidth={1.6}
          />
          <path
            d={`M${x + 35} ${y + 42} V${y + 58}`}
            stroke="var(--house-outline)"
            strokeWidth={1.4}
          />
          <circle cx={x + 31} cy={y + 50} r={1.3} fill="var(--house-outline)" />
          <circle cx={x + 39} cy={y + 50} r={1.3} fill="var(--house-outline)" />
          <path
            d={`M${x + 30} ${y + 31} H${x + 40} L${x + 39} ${y + 39} H${x + 31} Z`}
            fill="#C9876B"
            stroke="var(--house-outline)"
            strokeWidth={1.3}
          />
          <circle
            cx={x + 35}
            cy={y + 27}
            r={6}
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={1.2}
          />
        </g>
      );

    default:
      return null;
  }
}

export const HouseBoard: React.FC<HouseBoardProps> = ({
  gameState,
  bouncingPawn,
}) => {
  const { n, pos, turn, done, tried, last } = gameState;

  const ladderPaths = Object.entries(LADDERS).map(([fromStr, toNum]) => {
    const start = getCellCenter(Number(fromStr));
    const end = getCellCenter(toNum);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);
    const ox = (-dy / len) * 9.5;
    const oy = (dx / len) * 9.5;
    const rails = `M${(start.x + ox).toFixed(1)} ${(start.y + oy).toFixed(1)}L${(end.x + ox).toFixed(1)} ${(end.y + oy).toFixed(1)}M${(start.x - ox).toFixed(1)} ${(start.y - oy).toFixed(1)}L${(end.x - ox).toFixed(1)} ${(end.y - oy).toFixed(1)}`;
    let rungsPath = '';
    const rungs = Math.max(4, Math.round(len / 17));
    for (let i = 1; i < rungs; i++) {
      const t = i / rungs;
      const rx = start.x + dx * t;
      const ry = start.y + dy * t;
      rungsPath += `M${(rx + ox).toFixed(1)} ${(ry + oy).toFixed(1)}L${(rx - ox).toFixed(1)} ${(ry - oy).toFixed(1)}`;
    }
    return { key: fromStr, rails, rungsPath };
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
      const wave = Math.sin(t * Math.PI * 3) * 12 * (1 - t * 0.45);
      d +=
        (i ? 'L' : 'M') +
        (start.x + dx * t + nx * wave).toFixed(1) +
        ' ' +
        (start.y + dy * t + ny * wave).toFixed(1);
    }
    return {
      key: fromStr,
      d,
      headX: start.x,
      headY: start.y,
    };
  });

  return (
    <div className="w-full bg-[var(--card)] rounded-2xl p-3 shadow-md border-2 border-[var(--line)]/15">
      <svg
        id="house"
        viewBox="0 0 520 592"
        role="img"
        aria-label="Tablero de serpientes y escaleras en una casita ilustrada de pisos y habitaciones"
        className="block w-full h-auto select-none"
      >
        <defs>
          {Array.from({ length: 36 }, (_, idx) => idx + 1).map((sq) => {
            const { x, y } = getCellTopLeft(sq);
            return (
              <clipPath key={`clip-${sq}`} id={`pc${sq}`}>
                <rect x={x + 18} y={y + 21} width={34} height={38} rx={4} />
              </clipPath>
            );
          })}
        </defs>

        {/* Brick Chimney */}
        <g>
          <rect
            x={386}
            y={36}
            width={42}
            height={68}
            fill="#C79F98"
            stroke="var(--house-outline)"
            strokeWidth={3}
          />
          <path
            d="M386 58 H428 M386 76 H428 M407 36 V58 M397 58 V76 M416 58 V76"
            stroke="var(--house-outline)"
            strokeWidth={1.6}
            opacity={0.45}
          />
          <rect
            x={378}
            y={26}
            width={58}
            height={14}
            rx={4}
            fill="var(--house-trim)"
            stroke="var(--house-outline)"
            strokeWidth={3}
          />
        </g>

        {/* Attic Gable */}
        <polygon
          points="44,142 260,30 476,142"
          fill="var(--house-gable)"
          stroke="var(--house-outline)"
          strokeWidth={3}
        />
        <g opacity={0.18} stroke="var(--house-outline)" strokeWidth={1.3}>
          <path d="M125 102 H160 M360 102 H395 M92 122 H130 M390 122 H428 M200 72 H225 M295 72 H320" />
        </g>

        {/* Attic Round 4-Pane Window */}
        <g>
          <circle
            cx={260}
            cy={88}
            r={30}
            fill="var(--house-trim)"
            stroke="var(--house-outline)"
            strokeWidth={3}
          />
          <circle
            cx={260}
            cy={88}
            r={23}
            fill="var(--house-glass)"
            stroke="var(--house-outline)"
            strokeWidth={2.5}
          />
          <path
            d="M260 65 V111 M237 88 H283"
            stroke="var(--house-outline)"
            strokeWidth={2.5}
          />
        </g>

        {/* Pitched Roof Beam */}
        <polygon
          points="14,132 260,12 506,132 500,147 260,31 20,147"
          fill="var(--house-trim)"
          stroke="var(--house-outline)"
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {/* Hanging Exterior Lanterns (Left & Right Eaves) */}
        {[30, 490].map((lx, idx) => (
          <g key={`lantern-${idx}`}>
            <path
              d={`M${lx} 142 V157`}
              stroke="var(--house-outline)"
              strokeWidth={2.5}
            />
            <path
              d={`M${lx - 9} 163 L${lx} 156 L${lx + 9} 163 Z`}
              fill="var(--house-trim)"
              stroke="var(--house-outline)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <rect
              x={lx - 7}
              y={163}
              width={14}
              height={16}
              rx={2}
              fill="#FBE18A"
              stroke="var(--house-outline)"
              strokeWidth={2}
            />
            <rect
              x={lx - 4}
              y={179}
              width={8}
              height={4}
              rx={1}
              fill="var(--house-trim)"
              stroke="var(--house-outline)"
              strokeWidth={1.8}
            />
          </g>
        ))}

        {/* Exterior Potted Plants (Bottom Left & Right) */}
        <g aria-hidden="true">
          {/* Left exterior plant */}
          <path
            d="M20 532 Q12 496 22 478 Q31 502 26 532 Z"
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={2}
          />
          <path
            d="M26 532 Q25 486 35 466 Q40 498 32 532 Z"
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={2}
          />
          <path
            d="M15 530 H39 L36 568 H18 Z"
            fill="#C7866B"
            stroke="var(--house-outline)"
            strokeWidth={2.4}
          />
          {/* Right exterior plant */}
          <path
            d="M488 532 Q482 494 491 470 Q498 498 494 532 Z"
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={2}
          />
          <path
            d="M495 532 Q497 492 508 476 Q509 504 500 532 Z"
            fill="var(--house-leaf)"
            stroke="var(--house-outline)"
            strokeWidth={2}
          />
          <path
            d="M481 530 H505 L502 568 H484 Z"
            fill="#C7866B"
            stroke="var(--house-outline)"
            strokeWidth={2.4}
          />
        </g>

        {/* Outer House Frame (creates cozy floor beams & walls around rounded rooms) */}
        <rect
          x={BOARD_X - 6}
          y={BOARD_Y - 6}
          width={432}
          height={432}
          rx={6}
          fill="var(--house-trim)"
          stroke="var(--house-outline)"
          strokeWidth={3.2}
        />

        {/* Foundation Base Plinth */}
        <rect
          x={28}
          y={BOARD_Y + 422}
          width={464}
          height={14}
          rx={5}
          fill="var(--house-trim)"
          stroke="var(--house-outline)"
          strokeWidth={3}
        />

        {/* 36 Rounded Dollhouse Rooms */}
        {Array.from({ length: 36 }, (_, idx) => idx + 1).map((sq) => {
          const { x, y } = getCellTopLeft(sq);
          const wordId = SQUARE_TO_WORD[sq];
          const isStart = sq === 1;
          const isGoal = sq === 36;
          const isBonus = BONUS_TWO_SQUARES.includes(sq);
          const isDone = Boolean(wordId && done[wordId] !== undefined);
          const isTried = Boolean(wordId && tried[wordId] && !isDone);
          const wordItem = wordId ? WORD_MAP[wordId] : null;

          const roomFill = isStart
            ? 'var(--house-start)'
            : isGoal
              ? 'var(--house-goal)'
              : isBonus
                ? 'var(--house-free)'
                : 'var(--house-room)';

          return (
            <g key={`cell-${sq}`}>
              <rect
                x={x + 2.5}
                y={y + 2.5}
                width={CELL_SIZE - 5}
                height={CELL_SIZE - 5}
                rx={11}
                fill={roomFill}
                stroke="var(--house-outline)"
                strokeWidth={2.2}
              />

              {/* Subtle cozy furniture props in non-question transition rooms */}
              {!wordId && !isStart && !isGoal && !isBonus && renderRoomProp(sq, x, y)}

              {/* Room Number */}
              <text
                className="cnum"
                x={x + 8}
                y={y + 17}
                style={{ fill: 'var(--ink)' }}
              >
                {sq}
              </text>

              {/* SALIDA (Casilla 1) */}
              {isStart && (
                <g>
                  <path
                    d={`M${x + 30} ${y + 18} V${y + 42}`}
                    stroke="var(--house-outline)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${x + 30} ${y + 18} L${x + 50} ${y + 24} L${x + 30} ${y + 30} Z`}
                    fill="#679B50"
                    stroke="var(--house-outline)"
                    strokeWidth={1.6}
                    strokeLinejoin="round"
                  />
                  <rect
                    x={x + 11}
                    y={y + 44}
                    width={48}
                    height={16}
                    rx={5}
                    fill="#F9F4E8"
                    stroke="var(--house-outline)"
                    strokeWidth={1.6}
                  />
                  <text
                    className="font-hand font-bold"
                    x={x + 35}
                    y={y + 56}
                    textAnchor="middle"
                    style={{ fontSize: '12px', fill: '#1D2025' }}
                  >
                    SALIDA
                  </text>
                </g>
              )}

              {/* META (Casilla 36) */}
              {isGoal && (
                <g>
                  <path
                    d={`M${x + 28} ${y + 16} V${y + 42}`}
                    stroke="var(--house-outline)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${x + 28} ${y + 16} L${x + 51} ${y + 21} L${x + 48} ${y + 33} L${x + 28} ${y + 29} Z`}
                    fill="#FFFFFF"
                    stroke="var(--house-outline)"
                    strokeWidth={1.6}
                    strokeLinejoin="round"
                  />
                  <path
                    d={`M${x + 34} ${y + 18} L${x + 40} ${y + 19} V${y + 25} L${x + 34} ${y + 24} Z M${x + 40} ${y + 25} L${x + 46} ${y + 26} V${y + 32} L${x + 40} ${y + 31} Z`}
                    fill="#2A2E35"
                  />
                  <rect
                    x={x + 11}
                    y={y + 44}
                    width={48}
                    height={16}
                    rx={5}
                    fill="#FFF6D6"
                    stroke="var(--house-outline)"
                    strokeWidth={1.6}
                  />
                  <text
                    className="font-hand font-bold"
                    x={x + 35}
                    y={y + 56}
                    textAnchor="middle"
                    style={{ fontSize: '12px', fill: '#8B1D30' }}
                  >
                    META
                  </text>
                </g>
              )}

              {/* Bonus +2 Tiles */}
              {isBonus && (
                <g>
                  <path
                    d={`M${x + 27} ${y + 23} L${x + 33} ${y + 28} L${x + 27} ${y + 33} M${x + 36} ${y + 23} L${x + 42} ${y + 28} L${x + 36} ${y + 33}`}
                    fill="none"
                    stroke="var(--house-outline)"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    className="font-hand font-bold"
                    x={x + CELL_SIZE / 2}
                    y={y + 52}
                    textAnchor="middle"
                    style={{ fontSize: '18px', fill: 'var(--ink)' }}
                  >
                    +2
                  </text>
                </g>
              )}

              {/* Question Portrait Frame */}
              {wordId && wordItem && (
                <g
                  className={`port ${isDone ? 'done' : ''} ${isTried ? 'tried' : ''}`}
                >
                  <rect
                    className="pf"
                    x={x + 16}
                    y={y + 19}
                    width={38}
                    height={42}
                    rx={6}
                  />
                  {isDone ? (
                    <image
                      href={getSignImageUrl(
                        wordItem.img[wordItem.img.length - 1]
                      )}
                      x={x + 18}
                      y={y + 21}
                      width={34}
                      height={38}
                      preserveAspectRatio="xMidYMin slice"
                      clipPath={`url(#pc${sq})`}
                    />
                  ) : (
                    <text
                      className="pq"
                      x={x + 35}
                      y={y + 40}
                    >
                      ?
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Entry Arrow pointing to Salida */}
        <path
          d="M6 533 H40 M30 524 L40 533 L30 542"
          fill="none"
          stroke="var(--house-outline)"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wooden Staircase Ladders */}
        {ladderPaths.map(({ key, rails, rungsPath }) => (
          <g key={`ladder-${key}`}>
            <path
              d={rungsPath}
              stroke="var(--house-outline)"
              strokeWidth={6}
              strokeLinecap="round"
            />
            <path
              d={rungsPath}
              stroke="var(--house-wood)"
              strokeWidth={3.4}
              strokeLinecap="round"
            />
            <path
              d={rails}
              stroke="var(--house-outline)"
              strokeWidth={6.5}
              strokeLinecap="round"
            />
            <path
              d={rails}
              stroke="#D8A776"
              strokeWidth={3.8}
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Cute Lilac Storybook Snakes */}
        {snakePaths.map(({ key, d, headX, headY }) => (
          <g key={`snake-${key}`}>
            <path
              d={d}
              fill="none"
              stroke="var(--house-outline)"
              strokeWidth={11.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.92}
            />
            <path
              d={d}
              fill="none"
              stroke="var(--house-snake)"
              strokeWidth={7.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Tiny forked tongue */}
            <path
              d={`M${headX + 8} ${headY + 1} L${headX + 15} ${headY + 3} M${headX + 13} ${headY + 2} L${headX + 16} ${headY - 1}`}
              stroke="#D94B5A"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
            {/* Snake head */}
            <circle
              cx={headX}
              cy={headY}
              r={10}
              fill="var(--house-snake)"
              stroke="var(--house-outline)"
              strokeWidth={2.2}
            />
            <circle cx={headX - 3} cy={headY - 2.5} r={2.2} fill="#FFFFFF" />
            <circle cx={headX + 3.5} cy={headY - 2.5} r={2.2} fill="#FFFFFF" />
            <circle cx={headX - 2.6} cy={headY - 2.5} r={1.2} fill="#1D2025" />
            <circle cx={headX + 3.9} cy={headY - 2.5} r={1.2} fill="#1D2025" />
          </g>
        ))}

        {/* Highlighted Last Square */}
        {last && (
          <rect
            className="landed"
            x={getCellTopLeft(last).x + 2.5}
            y={getCellTopLeft(last).y + 2.5}
            width={CELL_SIZE - 5}
            height={CELL_SIZE - 5}
            rx={11}
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
