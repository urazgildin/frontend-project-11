const parseData = (string) => {
  const feedState = {
    title: '',
    description: '',
    posts: '',
  };

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
    const postsData = itemsAsArr.forEach((item) => {
      const itemTitle = item.querySelector('title').textContent;
      const itemLink = item.querySelector('link').textContent;
      return { title: itemTitle, link: itemLink };
    });
    feedsAndPosts.posts = postsData;
  }
  return feedState;
};

const updatePosts = (feeds) => {
  const promises = feeds.map((feed) => axios.get(buildUrl(feed)));
  const promise = Promise.all(promises);
  promise.then((responses) => {
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
    .then(() => setTimeout(checkRss, 5000, feeds));
};

export default parseData;
