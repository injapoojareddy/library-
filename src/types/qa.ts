export interface KeywordWeight {
  keyword: string;
  weight: number;
}

export interface TopicRule {
  topic: string;
  displayName: string;
  keywords: KeywordWeight[];
}

export interface ParsedLineIndexed {
  lineNumber: number;
  raw: string;
  status: 'indexed';
  topic: string;
  answer: string;
}

export interface ParsedLineSkipped {
  lineNumber: number;
  raw: string;
  status: 'skipped';
  reason: string;
}

export type ParsedLine = ParsedLineIndexed | ParsedLineSkipped;

export interface KnowledgeBaseResult {
  entries: Record<string, string>;
  orderedTopics: string[];
  parsedLines: ParsedLine[];
}

export interface TokenTraceItem {
  raw: string;
  isStopWord: boolean;
  stripped: string;
}

export interface TokenizationResult {
  lowerCased: string;
  allTokens: string[];
  filteredTokens: string[];
  strippedTokens: string[];
  trace: TokenTraceItem[];
}

export interface MatchedKeyword {
  token: string;
  keyword: string;
  weight: number;
}

export interface TopicScore {
  topic: string;
  displayName: string;
  score: number;
  matchedKeywords: MatchedKeyword[];
  inKnowledgeBase: boolean;
}

export interface QAResult {
  question: string;
  tokenization: TokenizationResult;
  topicScores: TopicScore[];
  winningTopic: string | null;
  winningScore: number;
  passedThreshold: boolean;
  answer: string;
  isFallback: boolean;
  responseTimeMs: number;
}
