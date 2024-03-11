import axios from 'axios';

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
    const items = doc.querySelectorAll('item');
    const itemsAsArr = Array.from(items);
    const postsData = itemsAsArr.map((item) => {
      const itemTitle = item.querySelector('title').textContent;
      const itemLink = item.querySelector('link').textContent;
      return { title: itemTitle, link: itemLink };
    });
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

const updatePosts = (feeds, watchedState) => {
  const promises = feeds.map((feed) => axios.get(buildUrl(feed)));
  Promise.all(promises)
    .then((responses) => {
      const posts = responses.map((response) => {
        const data = response.data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/xml');
        const items = doc.querySelectorAll('item');
        const itemsAsArr = Array.from(items);
        const postsData = itemsAsArr.map((item) => {
          const itemTitle = item.querySelector('title').textContent;
          const itemLink = item.querySelector('link').textContent;
          return { title: itemTitle, link: itemLink };
        });
        return postsData;
      });
      const flatPosts = posts.flat();
      watchedState.posts = flatPosts;
    })
    .then(() => setTimeout(updatePosts, 5000, feeds));
};

export { parseData, buildUrl, updatePosts };
