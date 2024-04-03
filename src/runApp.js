import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watch from './view.js';
import resources from './locales/ru.js';
import settings from './locales/setting.js';
import { parseData, getPostsData } from './parser.js';
import { buildUrl, compareListsOfPosts } from './utils.js';

const delay = 5000;

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
    .finally(() => setTimeout(updatePosts, delay, feeds, currentPosts, watchedState));
};

const app = (i118Instance) => {
  const state = {
    error: null,
    validRss: [],
    feeds: [],
    posts: [],
    uiState: {
      readenPosts: [],
      activePost: '',
    },
  };

  const form = document.querySelector('.rss-form');
  const postsEl = document.querySelector('.posts');
  const input = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');
  const feedsEl = document.querySelector('.feeds');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');

  const watchedState = watch(
    state,
    i118Instance,
    input,
    feedback,
    feedsEl,
    postsEl,
    modalTitle,
    modalBody,
  );
  setTimeout(updatePosts, delay, state.validRss, state.posts, watchedState);

  yup.setLocale(settings);

  const schema = yup.string().required().url();

  const validate = (data, feeds) => {
    const actualSchema = schema.notOneOf(feeds);
    return actualSchema.validate(data);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUrl = formData.get('url');
    validate(newUrl, state.validRss)
      .then(() => axios.get(buildUrl(newUrl)))
      .then((response) => {
        const data = response.data.contents;
        const { feed, posts } = parseData(data);
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);
        state.validRss.push(newUrl);
        watchedState.error = null;
        form.reset();
      })
      .catch((err) => {
        switch (err.name) {
          case 'RSS':
            watchedState.error = 'feedbackTexts.notRss';
            break;
          case 'AxiosError':
            watchedState.error = 'feedbackTexts.netsError';
            break;
          default:
            watchedState.error = err.message.key;
        }
      });
  });

  postsEl.addEventListener('click', (e) => {
    const currentId = e.target.dataset.id;
    const [activePost] = state.posts.filter((post) => post.id === currentId);
    if (e.target.tagName === 'A') {
      watchedState.uiState.readenPosts.push(currentId);
    }
    if (e.target.tagName === 'BUTTON') {
      watchedState.uiState.activePost = activePost;
      watchedState.uiState.readenPosts.push(currentId);
    }
  });
};

const runApp = () => {
  const i18nInst = i18next.createInstance();
  i18nInst.init({
    lng: 'ru',
    resources,
  }).then(() => {
    app(i18nInst);
  });
};

export default runApp;
