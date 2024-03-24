import axios from 'axios';
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

const buildUrl = (adress) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', adress);
  return url;
};

const compareListsOfPosts = (oldPosts, newPosts) => {
  const oldPostsTitles = oldPosts.map((post) => post.title);
  const filteredPosts = newPosts.filter((post) => !oldPostsTitles.includes(post.title));
  return filteredPosts;
};

const updatePosts = (feeds, currentPosts, watchedState) => {
  const promises = feeds.map((feed) => axios.get(buildUrl(feed)));
  Promise.all(promises)
    .then((responses) => {
      const posts = responses.map((response) => {
        const data = response.data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/xml');
        const postsData = getPostsData(doc);
        return postsData;
      });
      const newPosts = compareListsOfPosts(currentPosts, posts.flat());
      if (newPosts.length !== 0) {
        watchedState.posts.push(...newPosts);
      }
    })
    .finally(() => setTimeout(updatePosts, 5000, feeds, currentPosts, watchedState));
};

export { parseData, buildUrl, updatePosts };
