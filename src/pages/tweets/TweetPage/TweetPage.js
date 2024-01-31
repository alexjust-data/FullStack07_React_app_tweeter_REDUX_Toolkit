import { useParams } from 'react-router';
import Content from '../../../components/layout/Content';
import { useDispatch, useSelector } from 'react-redux';
import { getTweet } from '../../../store/selectors';
import { useEffect } from 'react';
import { detailTweets } from '../../../store/actions';

function TweetPage() {
  const params = useParams();
  // const tweet = useSelector(state => getTweet(state, params.tweetId));
  const tweet = useSelector(getTweet(params.tweetId));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(detailTweets(params.tweetId));
  }, [dispatch, params.tweetId]);

  return (
    <Content title="Tweet detail">
      <div>
        Tweet detail {params.tweetId} goes here...
        {tweet && (
          <div>
            <code>{JSON.stringify(tweet)}</code>
          </div>
        )}
      </div>
    </Content>
  );
}

export default TweetPage;
