import { getTweet } from '../selectors';

describe('getTweet', () => {
  const tweetId = '1';
  const tweets = [{ id: +tweetId }];
  const state = { tweets: { data: tweets } };

  test('should return a tweet by tweetId', () => {
    expect(getTweet(tweetId)(state)).toBe(tweets[0]);
  });

  test('should not return any tweet', () => {
    expect(getTweet('2')(state)).toBeUndefined();
  });
});
