import {
  Crawler,
  DiskCache,
  Fetcher,
  Workflow,

  CrawlStep,
  ConstStep,
  FetchStep,
  ExtractStep,
  ExportStep,

  getAI,
  getExtractor,
} from 'fetchfox';

console.log('hello', ConstStep);

const cache = new DiskCache('/tmp/fetchfox_bd1', { ttls: 10 * 24 * 3600 });
// const cache = null;

const ai = getAI('openai:gpt-4o-mini', { cache });
const crawler = new Crawler({ ai, cache });
const fetcher = new Fetcher({ cache });
const extractor = getExtractor('single-prompt', { ai, cache });

const url = 'https://news.ycombinator.com/news';
const query = 'Links to comment pages. The url MUST match this format: https://news.ycombinator.com/item?id=...';
const questions = [
  'What is the title of the article?',
  'What is the URL of the article?',
  'Who submitted this article?',
  'How many points does the article have? Format: number',
  'How many comments does the article have? Format: number',
];

const steps = [
  new ConstStep(url),
  new CrawlStep({ crawler, query, limit: 10 }),
  new FetchStep({ fetcher }),
  new ExtractStep({ questions, extractor }),
  new ExportStep({ filename: './out1.csv', format: 'csv' }),
];

const flow = new Workflow(steps);

const stream = flow.stream();
for await (const { cursor, delta, index } of stream) {
  console.log(`Step ${index} delta: ${delta}`);
}
