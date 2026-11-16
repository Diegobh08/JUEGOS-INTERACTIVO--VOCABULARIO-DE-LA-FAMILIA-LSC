import {
  QuestionConfig,
  TreeNode,
  WordItem,
} from '../types';

export const WORDS: WordItem[] = [
  {
    id: 'hombre',
    w: 'Hombre',
    img: ['hombre'],
    d: 'Índice y pulgar juntos bajo la nariz se separan hacia un lado, como un bigote.',
    sentence: 'Ese hombre de la foto es mi abuelo, el papá de mi papá.',
  },
  {
    id: 'mujer',
    w: 'Mujer',
    img: ['mujer'],
    d: 'Dedos juntos sobre la mejilla, con un pequeño movimiento circular.',
    sentence: 'Esa mujer que aparece en el retrato es mi abuela.',
  },
  {
    id: 'amigo',
    w: 'Amigo',
    img: ['amigo'],
    d: 'Los índices en gancho se enganchan y las manos giran juntas.',
    sentence: 'Él es mi amigo, aunque no es de la familia siempre está cerca.',
  },
  {
    id: 'familia',
    w: 'Familia',
    img: ['familia'],
    d: 'Índices y pulgares forman anillos enlazados; luego las manos se abren y giran hacia afuera.',
    sentence: 'Todas las personas que están en este árbol forman mi familia.',
  },
  {
    id: 'bebe',
    w: 'Bebé',
    img: ['bebe'],
    d: 'Brazos cruzados como cargando, con balanceo de lado a lado.',
    sentence: 'El bebé que acaba de nacer es mi nieto.',
  },
  {
    id: 'nino',
    w: 'Niño',
    img: ['nino'],
    d: 'Mano frente a la boca con un pequeño movimiento repetido hacia el lado.',
    sentence: 'Ese niño tiene ocho años y es mi sobrino.',
  },
  {
    id: 'abuelo',
    w: 'Abuelo',
    img: ['abuelo'],
    d: 'Mano junto a la mejilla con un movimiento corto y repetido.',
    sentence: 'El que está en la foto es mi abuelo, el papá de mi papá.',
  },
  {
    id: 'papa',
    w: 'Papá',
    img: ['papa'],
    d: 'El índice flexionado toca bajo la nariz.',
    sentence: 'Mi papá es el hermano de mi tío y el hijo de mi abuelo.',
  },
  {
    id: 'mama',
    w: 'Mamá',
    img: ['mama'],
    d: 'La palma abierta toca el pecho.',
    sentence: 'Mi mamá y mi papá cuidan juntos de toda nuestra familia.',
  },
  {
    id: 'tio',
    w: 'Tío',
    img: ['tio'],
    d: 'Los dos índices se cruzan frente al pecho con un movimiento hacia arriba.',
    sentence: 'El que está en la foto es mi tío, el hermano de mi mamá.',
  },
  {
    id: 'primo',
    w: 'Primo',
    img: ['primo'],
    d: 'Los índices en gancho se tocan y una mano baja.',
    sentence: 'Mi primo es el hijo de mi tío o mi tía.',
  },
  {
    id: 'hermano',
    w: 'Hermano',
    img: ['hermano'],
    d: 'Dos puños con los índices extendidos se deslizan adelante y atrás, alternando.',
    sentence: 'Mi hermano es el otro hijo de mi papá y mi mamá.',
  },
  {
    id: 'padrino',
    w: 'Padrino',
    img: ['padrino'],
    d: 'Mano abierta junto a la mejilla que baja rozándola.',
    sentence: 'Él es el padrino que acompañó a mi hijo en su bautizo.',
  },
  {
    id: 'novio',
    w: 'Novio',
    img: ['novio'],
    d: 'Dos puños juntos frente al pecho suben y bajan alternadamente.',
    sentence: 'Antes de casarse con su esposa, él era su novio.',
  },
  {
    id: 'esposa',
    w: 'Esposa',
    img: ['esposa'],
    d: 'Una mano toma el dedo anular de la otra y baja, como poniendo un anillo.',
    sentence: 'Ella es mi esposa, la mamá de mi hijo.',
  },
  {
    id: 'suegro',
    w: 'Suegro',
    img: ['suegro'],
    d: 'Mano abierta en alto; luego puño con el pulgar arriba que sube y baja.',
    sentence: 'El señor de la foto es mi suegro, el papá de mi esposa.',
  },
  {
    id: 'cunado',
    w: 'Cuñado',
    img: ['cunado'],
    d: 'Mano a la altura del hombro; el índice se dobla varias veces junto al pulgar.',
    sentence: 'Mi cuñado es el hermano de mi esposa.',
  },
  {
    id: 'mcivil',
    w: 'Matrimonio civil',
    img: ['matrimonio', 'civil'],
    d: 'MATRIMONIO: una mano se desliza sobre los dedos de la otra. CIVIL: la mano sube del abdomen al pecho.',
    sentence: 'Celebramos el matrimonio civil ante un notario o un juez.',
  },
  {
    id: 'mcatolico',
    w: 'Matrimonio católico',
    img: ['matrimonio', 'catolico'],
    d: 'MATRIMONIO: una mano se desliza sobre los dedos de la otra. CATÓLICO: índice y medio trazan una cruz en la frente.',
    sentence: 'El matrimonio católico se realiza en una ceremonia en la iglesia.',
  },
  {
    id: 'hijo',
    w: 'Hijo',
    img: ['hijo'],
    d: 'Los dedos tocan la nariz y bajan hasta la palma de la otra mano.',
    sentence: 'El que está en el retrato es mi hijo, el papá de mi nieto.',
  },
  {
    id: 'sobrino',
    w: 'Sobrino',
    img: ['sobrino'],
    d: 'Mano en C sobre el dorso de la otra mano; luego se desliza por el antebrazo.',
    sentence: 'Mi sobrino es el hijo de mi hermano.',
  },
  {
    id: 'nieto',
    w: 'Nieto',
    img: ['nieto'],
    d: 'Los dedos tocan la nariz y bajan en dos escalones.',
    sentence: 'Mi nieto es el hijo de mi hijo.',
  },
];

export const WORD_MAP: Record<string, WordItem> = Object.fromEntries(
  WORDS.map((w) => [w.id, w])
);

export const DEFAULT_POOL = [
  'abuelo',
  'papa',
  'mama',
  'tio',
  'primo',
  'hermano',
  'esposa',
  'suegro',
  'cunado',
  'hijo',
  'sobrino',
  'nieto',
];

const GENDER_POOL = ['amigo', 'familia', 'novio', 'padrino'];

export const QUESTIONS: Record<string, QuestionConfig> = {
  hombre: {
    sq: 2,
    t: 'abuelo',
    clue: 'Mira a la persona que marca la flecha. ¿Es hombre o mujer?',
    must: ['mujer'],
    pool: GENDER_POOL,
  },
  mujer: {
    sq: 4,
    t: 'abuela',
    clue: 'Mira a la persona que marca la flecha. ¿Es hombre o mujer?',
    must: ['hombre'],
    pool: GENDER_POOL,
  },
  bebe: {
    sq: 5,
    t: 'nieto',
    clue: 'Esta persona acaba de nacer. ¿Qué es?',
    must: ['nino'],
    pool: ['familia', 'amigo', 'mcivil', 'padrino'],
  },
  nino: {
    sq: 7,
    t: 'sobrino',
    clue: 'Esta persona tiene 8 años. ¿Qué es?',
    must: ['bebe'],
    pool: ['familia', 'amigo', 'mcatolico', 'padrino'],
  },
  amigo: {
    sq: 9,
    t: 'amigo',
    clue: 'No es de mi familia, pero es muy cercano a mí, sin tener un vínculo amoroso.',
    pool: ['primo', 'hermano', 'cunado', 'tio'],
  },
  familia: {
    sq: 10,
    t: 'all',
    clue: 'Todas las personas con las que comparto un vínculo sanguíneo (observa la línea roja que encierra a las personas).',
    pool: ['mcivil', 'amigo', 'padrino', 'hermano'],
  },
  papa: {
    sq: 12,
    t: 'papa',
    clue: 'Es el hijo de mi abuelo y esposo de mi madre. ¿Qué es para mí?',
  },
  mama: {
    sq: 13,
    t: 'mama',
    clue: 'Es la esposa de mi padre. ¿Qué es para mí?',
  },
  abuelo: {
    sq: 15,
    t: 'abuelo',
    clue: 'Es el papá de mi papá. ¿Qué es para mí?',
  },
  hermano: {
    sq: 16,
    t: 'hermano',
    clue: 'Es el otro hijo de mis padres. ¿Qué es para mí?',
  },
  tio: {
    sq: 17,
    t: 'tio',
    clue: 'Es el hermano de mi papá o de mi mamá. ¿Qué es para mí?',
  },
  primo: {
    sq: 18,
    t: 'primo',
    clue: 'Es el hijo de mi tío o mi tía. ¿Qué es para mí?',
  },
  novio: {
    sq: 21,
    t: 'yo',
    clue: 'Persona fuera de mi familia con la que comparto un vínculo amoroso.',
    pool: ['hermano', 'primo', 'padrino', 'suegro'],
  },
  esposa: {
    sq: 22,
    t: 'esposa',
    clue: 'Después de ser novios, es la persona con la que me casé.',
  },
  suegro: {
    sq: 23,
    t: 'suegro',
    clue: 'Es el papá de mi esposa. ¿Qué es para mí?',
  },
  cunado: {
    sq: 24,
    t: 'cunado',
    clue: 'Es el hermano de mi esposa. ¿Qué es para mí?',
  },
  padrino: {
    sq: 25,
    t: 'padrino',
    clue: 'Esta persona acompañó a mi hijo en su bautizo. ¿Qué es para él?',
    pool: ['abuelo', 'tio', 'suegro', 'cunado'],
  },
  mcivil: {
    sq: 28,
    t: 'wed',
    clue: 'Mi esposa y yo nos casamos ante un notario o un juez. ¿Cómo se llama?',
    must: ['mcatolico'],
    pool: ['familia', 'amigo', 'novio'],
  },
  mcatolico: {
    sq: 30,
    t: 'wed',
    clue: 'Mi esposa y yo nos casamos en la iglesia. ¿Cómo se llama?',
    must: ['mcivil'],
    pool: ['familia', 'amigo', 'novio'],
  },
  hijo: {
    sq: 31,
    t: 'hijo',
    clue: 'Nació de mi esposa y de mí. ¿Qué es para mí?',
  },
  sobrino: {
    sq: 33,
    t: 'sobrino',
    clue: 'Es el hijo de mi hermano, y yo soy su tío. ¿Qué es para mí?',
  },
  nieto: {
    sq: 35,
    t: 'nieto',
    clue: 'Es el hijo de mi hijo. ¿Qué es para mí?',
  },
};

export const SQUARE_TO_WORD: Record<number, string> = {};
for (const wordId in QUESTIONS) {
  SQUARE_TO_WORD[QUESTIONS[wordId].sq] = wordId;
}

export const BONUS_TWO_SQUARES = [6, 20, 27];

export const BACK_ONE_SQUARES = [11, 32];

export const LADDERS: Record<number, number> = {
  3: 15,
  8: 21,
  19: 30,
};

export const SNAKES: Record<number, number> = {
  14: 2,
  26: 22,
  29: 18,
  34: 23,
};

export const TREE_NODES: TreeNode[] = [
  { id: 'abuelo', x: 160, y: 14, type: 'slot' },
  { id: 'abuela', x: 276, y: 14, type: 'ghost', label: 'Abuela' },
  { id: 'tio', x: 20, y: 170, type: 'slot' },
  { id: 'tia', x: 136, y: 170, type: 'ghost', label: 'Tía' },
  { id: 'papa', x: 300, y: 170, type: 'slot' },
  { id: 'mama', x: 416, y: 170, type: 'slot' },
  { id: 'suegro', x: 610, y: 170, type: 'slot' },
  { id: 'suegra', x: 726, y: 170, type: 'ghost', label: 'Suegra' },
  { id: 'primo', x: 78, y: 326, type: 'slot' },
  { id: 'hermano', x: 250, y: 326, type: 'slot' },
  { id: 'yo', x: 380, y: 326, type: 'me' },
  { id: 'esposa', x: 540, y: 326, type: 'slot' },
  { id: 'cunado', x: 700, y: 326, type: 'slot' },
  { id: 'sobrino', x: 250, y: 482, type: 'slot' },
  { id: 'hijo', x: 460, y: 482, type: 'slot' },
  { id: 'padrino', x: 640, y: 482, type: 'slot' },
  { id: 'amigo', x: 40, y: 638, type: 'slot' },
  { id: 'nieto', x: 460, y: 638, type: 'slot' },
];

export const TREE_NODE_MAP: Record<string, TreeNode> = Object.fromEntries(
  TREE_NODES.map((n) => [n.id, n])
);

export const TREE_SOLID_PATH =
  'M256 70H276 M266 70V150 M68 150H348 M68 150V170 M348 150V170 M116 226H136 M126 226V326 M396 226H416 M406 226V306 M298 306H428 M298 306V326 M428 306V326 M706 226H726 M716 226V306 M588 306H748 M588 306V326 M748 306V326 M476 382H540 M508 382V482 M298 438V482 M508 594V638';

export const TREE_DASHED_PATH = 'M556 538H640 M400 438V694H136';

export const TEAM_COLOR_VARS = ['--t1', '--t2', '--t3', '--t4'];

export const DIE_PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export const DEFAULT_SIGN_VIDEOS: Record<string, string> = {
  abuelo:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_8.47.55_PM__2__ad282f6a.mp4',
  amigo:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_8.47.55_PM__1__3e42114f.mp4',
  bebe:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_8.47.55_PM_b1b6b135.mp4',
  cunado:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_8.47.46_PM_b8c78072.mp4',
  esposa:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_8.47.45_PM_e3f6b9f8.mp4',
  familia:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_10.24.22_PM__3__084ce41c.mp4',
  hermano:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_10.24.22_PM__2__152f0a9a.mp4',
  hombre:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_10.24.22_PM__1__6f422231.mp4',
  mama:
    '/assets/aistudio/WhatsApp_Video_2026-11-14_at_10.24.22_PM_1dc916e1.mp4',
};

export function getSignImageUrl(name: string): string {
  return `/senas/${name}.jpg`;
}
