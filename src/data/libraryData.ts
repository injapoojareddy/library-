import type { TopicRule } from '../types/qa';

export const SCORE_THRESHOLD = 2;

export const FALLBACK_ANSWER = 'Sorry, the answer is not available in the document.';

export const DEFAULT_LIBRARY_TEXT = [
  'College Library Rules and Information',
  'Library timings: The college library is open from 9:00 AM to 6:00 PM, Monday to Saturday.',
  'Maximum books: Students can borrow a maximum of 4 books at a time.',
  'Book return period: Borrowed books must be returned within 14 days.',
  'Late return fine: A fine of Rs. 5 per day is charged for late book returns.',
  'Library membership: All enrolled students and faculty members are eligible for library membership and can register at the circulation desk.',
].join('\n');

export const WEIGHTED_RULES: TopicRule[] = [
  {
    topic: 'library timings',
    displayName: 'Library timings',
    keywords: [
      { keyword: 'timing', weight: 3 },
      { keyword: 'open', weight: 3 },
      { keyword: 'close', weight: 3 },
      { keyword: 'time', weight: 2 },
      { keyword: 'hour', weight: 2 },
      { keyword: 'schedule', weight: 2 },
      { keyword: 'clock', weight: 1 },
      { keyword: 'am', weight: 1 },
      { keyword: 'pm', weight: 1 },
    ],
  },
  {
    topic: 'maximum books',
    displayName: 'Maximum books',
    keywords: [
      { keyword: 'limit', weight: 3 },
      { keyword: 'maximum', weight: 2 },
      { keyword: 'borrow', weight: 2 },
      { keyword: 'issue', weight: 2 },
      { keyword: 'number', weight: 2 },
      { keyword: 'book', weight: 1 },
      { keyword: 'many', weight: 1 },
      { keyword: 'copy', weight: 1 },
    ],
  },
  {
    topic: 'book return period',
    displayName: 'Book return period',
    keywords: [
      { keyword: 'period', weight: 3 },
      { keyword: 'days', weight: 3 },
      { keyword: 'keep', weight: 3 },
      { keyword: 'due', weight: 3 },
      { keyword: 'duration', weight: 3 },
      { keyword: 'deadline', weight: 3 },
      { keyword: 'return', weight: 2 },
      { keyword: 'long', weight: 2 },
      { keyword: 'day', weight: 1 },
    ],
  },
  {
    topic: 'late return fine',
    displayName: 'Late return fine',
    keywords: [
      { keyword: 'fine', weight: 4 },
      { keyword: 'penalty', weight: 4 },
      { keyword: 'overdue', weight: 4 },
      { keyword: 'late', weight: 3 },
      { keyword: 'charge', weight: 3 },
      { keyword: 'cost', weight: 2 },
      { keyword: 'pay', weight: 2 },
      { keyword: 'rs', weight: 1 },
    ],
  },
  {
    topic: 'library membership',
    displayName: 'Library membership',
    keywords: [
      { keyword: 'membership', weight: 4 },
      { keyword: 'eligible', weight: 4 },
      { keyword: 'eligibility', weight: 4 },
      { keyword: 'access', weight: 3 },
      { keyword: 'join', weight: 3 },
      { keyword: 'member', weight: 3 },
      { keyword: 'register', weight: 3 },
      { keyword: 'allowed', weight: 3 },
      { keyword: 'use', weight: 2 },
      { keyword: 'enter', weight: 2 },
      { keyword: 'who', weight: 1 },
    ],
  },
];

export const STOP_WORDS = new Set(
  'what.how.can.the.is.are.do.does.i.a.an.for.of.to.in.on.my.me.and.or.be.must.when.where.with.per.from.at.by.there.if.it.its.this.that.will.should.could.would.have.has.about.much.get.take.until.need.we.you.they.any.library.college'.split(
    '.',
  ),
);

export const DEFAULT_WORKED_EXAMPLE = {
  question: 'How much penalty is charged for late returns?',
  expectedTopic: 'late return fine',
};

export const SAMPLE_QUESTIONS: string[] = [
  'How much penalty is charged for late returns?',
  'What time does the library open?',
  'What is the borrowing limit?',
  'How long can I keep borrowed books?',
  'Who can use the library?',
  'Where is the canteen?',
];

export const SYSTEM_METADATA = {
  title: 'AI-Based College Library Document Question Answering System',
  subtitle:
    'Rule-based document question answering powered by dictionary Knowledge Base indexing and weighted IF–THEN keyword scoring.',
};
