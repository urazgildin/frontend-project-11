import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watch from './view.js';
import resources from './locales/ru.js'
import parseData from './utils/parser.js'

const app = (i118Instance) => {
  const state = {
    stateOfValidation: '',
    data: '',
    error: '',
    validRss: [],
    feeds: [],
  };

  const watchedState = watch(state, i118Instance);

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

  const buildUrl = (adress) => {
    const url = new URL('https://allorigins.hexlet.app/get');
    url.searchParams.set('disableCache', 'true');
    url.searchParams.set('url', adress);
    return url;
  };

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUrl = formData.get('url');
    state.data = newUrl;
    validate(newUrl, state.validRss)
      .then(() => axios.get(buildUrl(newUrl)))
      .then((response) => {
        const data = response.data.contents;
        state.feeds.push(parseData(data));
        state.validRss.push(newUrl);
        form.reset();
        console.log(state);
        watchedState.error = null;
      })
      .catch((err) => {
        if (err.name === 'RSS') {
          watchedState.error = 'errors.notRss';
        } else {
          watchedState.error = err.message.key;
        }
        console.log(state)
      });
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
