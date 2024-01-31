import React from 'react';
import PropTypes from 'prop-types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import LikeButton from './LikeButton';
import Photo from '../../../components/shared/Photo';
import './Tweet.css';

const Tweet = ({ content, updatedAt, user, likes }) => {
  return (
    <article className="tweet bordered">
      <div className="left">
        <Photo className="tweet-photo" />
      </div>
      <div className="right">
        <div className="tweet-header">
          <span className="tweet-name">{user.name}</span>
          <span className="tweet-username">{user.username}</span>
          <span className="tweet-separator">·</span>
          <time dateTime={updatedAt}>
            {formatDistanceToNow(new Date(updatedAt))}
          </time>
        </div>
        <div>
          {content}
          <div className="tweet-actions">
            <LikeButton
              likes={likes.length}
              onLike={event => console.log(event)}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

Tweet.propTypes = {
  content: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
  likes: PropTypes.array.isRequired,
};

export default Tweet;
