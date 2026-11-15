export interface WordItem {
  id: string;
  w: string;
  img: string[];
  d: string;
  sentence: string;
}

export interface SentenceToken {
  text: string;
  wordId?: string;
}

export interface SentenceExample {
  id: string;
  title: string;
  tokens: SentenceToken[];
  signIds: string[];
  explanation: string;
}

export interface QuestionConfig {
  sq: number;
  t: string;
  clue: string;
  must?: string[];
  pool?: string[];
}

export interface TreeNode {
  id: string;
  x: number;
  y: number;
  type: 'slot' | 'ghost' | 'me';
  label?: string;
}

export interface GameState {
  n: number;
  pts: number[];
  pos: number[];
  turn: number;
  done: Record<string, number>;
  tried: Record<string, boolean>;
  last: number | null;
  mark: string | null;
  ended: boolean;
}

export type ViewMode = 'JUEGO' | 'VOCABULARIO' | 'FRASES';
