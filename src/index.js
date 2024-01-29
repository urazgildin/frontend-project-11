import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';

const state = {
  state: 'valid',
  data: '',
  errors: '',
  feeds: [],
};

const schema = yup.string().required().url().notOneOf(state.feeds);

const validate = (data) => schema.validate(data).then(() => '').catch((err) => err.errors);

const watchedState = onChange(state, (path, value) => {
  if (path === 'state') {
    const input = document.querySelector('.form-control');
    if (value === 'invalid') {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  }
});

const form = document.querySelector('.rss-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newUrl = formData.get('url');
  state.data = newUrl;
  validate(newUrl).then((data) => {
    state.errors = data;
  });
  if (state.errors !== '') {
    watchedState.state = 'invalid';
  } else {
    watchedState.state = 'valid';
    state.feeds.push(newUrl);
  }
});
