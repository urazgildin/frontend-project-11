import _ from 'lodash';

const getPostsData = (doc) => {
  const items = doc.querySelectorAll('item');
  const itemsAsArr = Array.from(items);
  const postsData = itemsAsArr.map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemId = _.uniqueId();
    return {
      title: itemTitle, link: itemLink, description: itemDescription, id: itemId,
    };
  });
  return postsData;
};

const parseData = (string) => {
  const feedsAndPosts = {
    feed: {
      title: '',
      description: '',
    },
    posts: '',
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'text/xml');
  const rss = doc.querySelector('rss');
  if (rss === null) {
    const error = new Error();
    error.name = 'RSS';
    throw error;
  } else {
    feedsAndPosts.feed.title = doc.querySelector('title').textContent;
    feedsAndPosts.feed.description = doc.querySelector('description').textContent;
    const postsData = getPostsData(doc);
    feedsAndPosts.posts = postsData;
  }
  return feedsAndPosts;
};

export { getPostsData, parseData };
