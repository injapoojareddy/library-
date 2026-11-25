import {
  FALLBACK_ANSWER,
  SCORE_THRESHOLD,
  STOP_WORDS,
  WEIGHTED_RULES,
} from '../data/libraryData';
import type {
  KnowledgeBaseResult,
  MatchedKeyword,
  ParsedLine,
  QAResult,
  TokenizationResult,
  TokenTraceItem,
  TopicRule,
  TopicScore,
} from '../types/qa';

export function parseKnowledgeBase(rawText: string): KnowledgeBaseResult {
  const lines = rawText.split(/\r?\n/);
  const entries: Record<string, string> = {};
  const orderedTopics: string[] = [];
  const parsedLines: ParsedLine[] = [];

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const trimmed = rawLine.trim();

    if (!trimmed) {
      parsedLines.push({
        lineNumber,
        raw: rawLine,
        status: 'skipped',
        reason: 'Empty line',
      });
      return;
    }

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) {
      parsedLines.push({
        lineNumber,
        raw: rawLine,
        status: 'skipped',
        reason: 'No colon delimiter (e.g. document title)',
      });
      return;
    }

    const topic = trimmed.slice(0, colonIndex).trim().toLowerCase();
    const answer = trimmed.slice(colonIndex + 1).trim();

    if (!topic || !answer) {
      parsedLines.push({
        lineNumber,
        raw: rawLine,
        status: 'skipped',
        reason: 'Missing topic or answer value',
      });
      return;
    }

    if (!(topic in entries)) {
      orderedTopics.push(topic);
    }
    entries[topic] = answer;
    parsedLines.push({
      lineNumber,
      raw: rawLine,
      status: 'indexed',
      topic,
      answer,
    });
  });

  return { entries, orderedTopics, parsedLines };
}

export function stripSuffix(token: string): string {
  if (token.endsWith('ies') && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }
  if (token.endsWith('ing') && token.length > 5) {
    return token.slice(0, -3);
  }
  if (token.endsWith('ed') && token.length > 4) {
    return token.slice(0, -2);
  }
  if (token.endsWith('s') && !token.endsWith('ss') && token.length > 2) {
    return token.slice(0, -1);
  }
  return token;
}

export function tokenizeAndNormalize(question: string): TokenizationResult {
  const lowerCased = question.toLowerCase().trim();
  const allTokens = lowerCased.match(/[a-z0-9]+/g) ?? [];
  const filteredTokens: string[] = [];
  const strippedTokens: string[] = [];
  const trace: TokenTraceItem[] = [];

  for (const token of allTokens) {
    const isStopWord = STOP_WORDS.has(token);
    const stripped = isStopWord ? token : stripSuffix(token);
    trace.push({ raw: token, isStopWord, stripped });

    if (!isStopWord) {
      filteredTokens.push(token);
      strippedTokens.push(stripped);
    }
  }

  return {
    lowerCased,
    allTokens,
    filteredTokens,
    strippedTokens,
    trace,
  };
}

export function evaluateQuestion(
  question: string,
  entries: Record<string, string>,
  rules: TopicRule[] = WEIGHTED_RULES,
): QAResult {
  const startTime = performance.now();
  const tokenization = tokenizeAndNormalize(question);

  const topicScores: TopicScore[] = rules.map((rule) => {
    let score = 0;
    const matchedKeywords: MatchedKeyword[] = [];
    const seenKeywords = new Set<string>();

    for (const item of tokenization.trace) {
      if (item.isStopWord) {
        continue;
      }

      const exactMatch = rule.keywords.find((kw) => kw.keyword === item.raw);
      const strippedMatch = exactMatch
        ? undefined
        : rule.keywords.find((kw) => kw.keyword === item.stripped);
      const matched = exactMatch ?? strippedMatch;

      if (matched && !seenKeywords.has(matched.keyword)) {
        seenKeywords.add(matched.keyword);
        score += matched.weight;
        matchedKeywords.push({
          token: exactMatch ? item.raw : item.stripped,
          keyword: matched.keyword,
          weight: matched.weight,
        });
      }
    }

    return {
      topic: rule.topic,
      displayName: rule.displayName,
      score,
      matchedKeywords,
      inKnowledgeBase: rule.topic in entries,
    };
  });

  let bestCandidate: TopicScore | null = null;
  for (const candidate of topicScores) {
    if (!bestCandidate || candidate.score > bestCandidate.score) {
      bestCandidate = candidate;
    }
  }

  const winningScore = bestCandidate ? bestCandidate.score : 0;
  const passedThreshold =
    winningScore >= SCORE_THRESHOLD &&
    bestCandidate !== null &&
    bestCandidate.inKnowledgeBase;

  const winningTopic =
    passedThreshold && bestCandidate !== null ? bestCandidate.topic : null;

  const answer = winningTopic ? entries[winningTopic] : FALLBACK_ANSWER;
  const endTime = performance.now();

  return {
    question,
    tokenization,
    topicScores,
    winningTopic,
    winningScore,
    passedThreshold,
    answer,
    isFallback: !winningTopic,
    responseTimeMs: Number((endTime - startTime).toFixed(4)),
  };
}
