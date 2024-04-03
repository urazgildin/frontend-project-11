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

export { buildUrl, compareListsOfPosts };
