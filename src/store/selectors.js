export const getIsLogged = state => state.auth;

export const getTweets = state => state.tweets.data;

export const areTweetsLoaded = state => state.tweets.areLoaded;

export const getTweet = tweetId => state =>
  getTweets(state).find(tweet => tweet.id === Number(tweetId));

// export const getTweet = (state, tweetId) =>
//   getTweets(state).find(tweet => tweet.id === Number(tweetId));

export const getUi = state => state.ui;
