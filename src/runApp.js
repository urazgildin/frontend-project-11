import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watch from './view.js';
import resources from './locales/ru.js'
import { parseData, buildUrl, updatePosts } from './utils.js'

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

  const watchedState = watch(state, i118Instance);
  updatePosts(state.validRss, state.posts, watchedState);

  yup.setLocale({
    string: {
      url: { key: 'errors.ifInvalid' },
    },
    mixed: {
      required: () => ({ key: 'errors.required' }),
      notOneOf: () => ({ key: 'errors.ifExist' }),
    },
  });

  const schema = yup.string().required().url();

  const validate = (data, feeds) => {
    const actualSchema = schema.notOneOf(feeds);
    return actualSchema.validate(data);
  };

  const form = document.querySelector('.rss-form');

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
        watchedState.posts.push(posts);
        state.validRss.push(newUrl);
        watchedState.error = null;
        form.reset();
      })
      .catch((err) => {
        if (err.name === 'RSS') {
          watchedState.error = 'errors.notRss';
        } else {
          watchedState.error = err.message.key;
        }
      });
  });

  const postsEl = document.querySelector('.posts');
  postsEl.addEventListener('click', (e) => {
    const currentId = e.target.dataset.id;
    const [activePost] = state.posts.flat().filter((post) => post.id === currentId);
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
