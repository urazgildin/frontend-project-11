const initView = (path, value) => {
  if (path === 'state') {
    const input = document.querySelector('.form-control');
    const feedback = document.querySelector('.feedback');
    if (value === 'invalid') {
      input.classList.add('is-invalid');
      feedback.textContent = i18nInst.t('ifInvalid');
    } else {
      input.classList.remove('is-invalid');
      feedback.textContent = i18nInst.t('success');
    }
  }
};

export default initView;
