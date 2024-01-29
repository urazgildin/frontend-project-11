const initView = (path, value) => {
  if (path === 'state') {
    const input = document.querySelector('.form-control');
    if (value === 'invalid') {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  }
};

export default initView;
