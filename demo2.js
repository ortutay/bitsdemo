import { fox } from 'fetchfox';

//  'find links to user profiles',

await fox.run(
  'https://news.ycombinator.com/news',
  'find links to comments',
  'get basic data',
  'export to out2.csv',
);
