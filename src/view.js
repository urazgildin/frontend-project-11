import onChange from 'on-change';

const watch = (state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'state') {
      const input = document.querySelector('.form-control');
      const feedback = document.querySelector('.feedback');
      if (value === 'invalid') {
        input.classList.add('is-invalid');
        feedback.textContent = i18n.t(state.error);
      } else {
        input.classList.remove('is-invalid');
        feedback.textContent = i18n.t('others.success');
      }
    }
  });
  return watchedState;
};

export default watch;
