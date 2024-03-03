import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import watch from './view.js';
import resources from './locales/ru.js'

const runApp = () => {
  const state = {
    state: 'valid',
    data: '',
    error: '',
    feeds: [],
  };

  const i18nInst = i18next.createInstance();
  i18nInst.init({
    lng: 'ru',
    resources,
  }).then(() => {
    const watchedState = watch(state, i18nInst);

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
      state.data = newUrl;
      validate(newUrl, watchedState.feeds)
        .then(() => {
          watchedState.state = 'valid';
          state.feeds.push(newUrl);
          form.reset();
        })
        .catch((err) => {
          state.error = err.message.key;
          watchedState.state = 'invalid';
        });
    });
  });
};
export default runApp;
