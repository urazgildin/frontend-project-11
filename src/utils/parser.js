const parseData = (string) => {
  const feedState = {
    id: '',
    title: '',
    description: '',
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
    feedState.title = doc.querySelector('title').textContent;
    feedState.description = doc.querySelector('description').textContent;
    const items = doc.querySelectorAll('item');
    const itemsAsArr = Array.from(items);
    const postsData = itemsAsArr.map((item) => {
      const itemTitle = item.querySelector('title').textContent;
      const itemLink = item.querySelector('link').textContent;
      return { title: itemTitle, link: itemLink };
    });
    feedState.posts = postsData;
  }
  return feedState;
};

export default parseData;
