import React from 'react';
import soyYoImg from '../assets/images/soy_yo_portrait_1795023870040.jpg';
import {
  CONCEPT_IMAGES,
  GHOST_NODE_IMAGES,
  TREE_DASHED_PATH,
  TREE_NODES,
  TREE_NODE_MAP,
  TREE_SOLID_PATH,
  WORD_MAP,
  getSignImageUrl,
} from '../data/familyData';
import { GameState } from '../types';

function getTargetBounds(target: string) {
  if (target === 'all') return { x: 4, y: 4, w: 832, h: 752 };
  if (target === 'wed') return { x: 478, y: 356, w: 60, h: 52 };
  const node = TREE_NODE_MAP[target];
  return node
    ? { x: node.x, y: node.y, w: 96, h: 112 }
    : { x: 380, y: 326, w: 96, h: 112 };
}

interface FamilyTreeProps {
  target: string | null;
  crop?: boolean;
  gameState: GameState;
  idPrefix?: string;
}

export const FamilyTree: React.FC<FamilyTreeProps> = ({
  target,
  crop = false,
  gameState,
  idPrefix = 'main',
}) => {
  const { done } = gameState;
  let viewBox = '0 0 840 760';

  if (crop && target && target !== 'all') {
    const b = getTargetBounds(target);
    const vx = Math.max(0, Math.min(280, b.x + b.w / 2 - 280));
    const vy = Math.max(0, Math.min(320, b.y + b.h / 2 - 220));
    viewBox = `${vx} ${vy} 560 440`;
  }

  const renderMarker = () => {
    if (!target) return null;
    const b = getTargetBounds(target);

    if (target === 'all') {
      return (
        <rect
          className="mark"
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={18}
          strokeDasharray="12 8"
        />
      );
    }

    const onRight = b.x + b.w + 80 < 840;
    const sx = onRight ? b.x + b.w + 70 : b.x - 70;
    const sy = Math.max(10, b.y - 50);
    const ex = onRight ? b.x + b.w + 14 : b.x - 14;
    const ey = b.y + 4;
    const angle = Math.atan2(ey - sy, ex - sx);
    const arrowHead = `M${ex} ${ey}L${ex - 16 * Math.cos(angle - 0.45)} ${ey - 16 * Math.sin(angle - 0.45)}L${ex - 16 * Math.cos(angle + 0.45)} ${ey - 16 * Math.sin(angle + 0.45)}Z`;

    return (
      <g>
        <ellipse
          className="mark"
          cx={b.x + b.w / 2}
          cy={b.y + b.h / 2}
          rx={b.w / 2 + 16}
          ry={b.h / 2 + 16}
        />
        {target === 'wed' && (
          <text
            className="wed font-hand font-bold"
            x={b.x + b.w / 2}
            y={b.y - 26}
          >
            unión
          </text>
        )}
        <path
          className="mark"
          d={`M${sx} ${sy}Q${(sx + ex) / 2 + (onRight ? 14 : -14)} ${(sy + ey) / 2 - 10} ${ex} ${ey}`}
        />
        <path className="markhead" d={arrowHead} />
      </g>
    );
  };

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label="Mi árbol genealógico"
      className="block w-full h-auto select-none"
    >
      <defs>
        {TREE_NODES.map((node) => (
          <clipPath key={`clip-${node.id}`} id={`${idPrefix}clip-${node.id}`}>
            <rect x={node.x + 6} y={node.y + 6} width={84} height={76} rx={4} />
          </clipPath>
        ))}
      </defs>

      <path className="ink" d={TREE_SOLID_PATH} />
      <path className="ink dash" d={TREE_DASHED_PATH} />

      {TREE_NODES.map((node) => {
        const { id, x, y, type, label } = node;
        const wordItem = WORD_MAP[id];
        const isDone = type === 'slot' && wordItem && done[id] !== undefined;
        let cls = `node ${type}`;
        if (isDone) cls += ' done';

        return (
          <g key={`tree-node-${id}`} className={cls}>
            <rect className="nb" x={x} y={y} width={96} height={112} rx={8} />

            {type === 'ghost' &&
              (GHOST_NODE_IMAGES[id] ? (
                <>
                  <rect
                    className="nimg"
                    x={x + 6}
                    y={y + 6}
                    width={84}
                    height={76}
                    rx={4}
                  />
                  <image
                    href={GHOST_NODE_IMAGES[id]}
                    x={x + 6}
                    y={y + 6}
                    width={84}
                    height={76}
                    preserveAspectRatio="xMidYMin slice"
                    clipPath={`url(#${idPrefix}clip-${id})`}
                  />
                  <text
                    className="nl font-hand font-bold"
                    x={x + 48}
                    y={y + 112 - 9}
                  >
                    {label}
                  </text>
                </>
              ) : (
                <text className="nl font-hand" x={x + 48} y={y + 56 + 6}>
                  {label}
                </text>
              ))}

            {type === 'me' && (
              <>
                <rect
                  className="nimg"
                  x={x + 6}
                  y={y + 6}
                  width={84}
                  height={76}
                  rx={4}
                />
                <image
                  href={soyYoImg}
                  x={x + 6}
                  y={y + 6}
                  width={84}
                  height={76}
                  preserveAspectRatio="xMidYMin slice"
                  clipPath={`url(#${idPrefix}clip-${id})`}
                />
                <text
                  className="nl font-hand font-bold"
                  x={x + 48}
                  y={y + 112 - 9}
                >
                  Soy yo
                </text>
                <ellipse className="mering" cx={x + 48} cy={y + 56} rx={62} ry={70} />
              </>
            )}

            {type === 'slot' &&
              wordItem &&
              (() => {
                const slotImg =
                  CONCEPT_IMAGES[id] || getSignImageUrl(wordItem.img[0]);
                return (
                  <>
                    <rect
                      className="nimg"
                      x={x + 6}
                      y={y + 6}
                      width={84}
                      height={76}
                      rx={4}
                    />
                    <image
                      href={slotImg}
                      x={x + 6}
                      y={y + 6}
                      width={84}
                      height={76}
                      preserveAspectRatio="xMidYMin slice"
                      clipPath={`url(#${idPrefix}clip-${id})`}
                    />
                    <text
                      className="nl font-hand font-bold"
                      x={x + 48}
                      y={y + 112 - 9}
                      style={isDone ? undefined : { fill: 'var(--muted)' }}
                    >
                      {isDone ? wordItem.w : '?'}
                    </text>
                    {isDone && (
                      <g>
                        <circle
                          cx={x + 86}
                          cy={y + 10}
                          r={9}
                          fill="var(--good)"
                          stroke="var(--imgbg)"
                          strokeWidth={1.8}
                        />
                        <path
                          d={`M${x + 82} ${y + 10} L${x + 85} ${y + 13} L${x + 90.5} ${y + 7.5}`}
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                  </>
                );
              })()}
          </g>
        );
      })}

      {renderMarker()}
    </svg>
  );
};
