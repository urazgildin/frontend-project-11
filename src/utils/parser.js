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
  } else {
    feedState.title = doc.querySelector('title').textContent;
    feedState.description = doc.querySelector('description').textContent;
    const items = doc.querySelectorAll('item');
    const itemsAsArr = Array.from(items);
    const postsData = itemsAsArr.map((item) => {
      const itemDescription = item.querySelector('description').textContent;
      const itemLink = item.querySelector('link').textContent;
      return { description: itemDescription, link: itemLink };
    });
    feedState.posts = postsData;
  }
  return feedState;
};

export default parseData;
