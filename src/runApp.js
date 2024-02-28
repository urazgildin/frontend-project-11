import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import initView from './view.js';
import resources from './locales/ru.js'

const runApp = async () => {
  const i18nInst = i18next.createInstance();
  await i18nInst.init({
    lng: 'ru',
    resources,
  });

  const state = {
    state: 'valid',
    data: '',
    errors: '',
    feeds: [],
  };

  const watchedState = onChange(state, initView);

  const schema = yup.string().required().url();

  const validate = (data, feeds) => {
    const actualSchema = schema.notOneOf(feeds);
    return actualSchema.validate(data).then(() => '').catch((err) => err.errors);
  };

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUrl = formData.get('url');
    state.data = newUrl;
    validate(newUrl, watchedState.feeds)
      .then((data) => {
        state.errors = data;
      })
      .then(() => {
        if (state.errors !== '') {
          watchedState.state = 'invalid';
        } else {
          watchedState.state = 'valid';
          state.feeds.push(newUrl);
        }
      });
  });
};

export default runApp;
