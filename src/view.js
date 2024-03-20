import onChange from 'on-change';

const constructNewCard = (textContent, ulEl) => {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('card', 'border-0');
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = textContent;
  innerDiv.append(h2);
  mainDiv.append(innerDiv);
  mainDiv.append(ulEl);
  return mainDiv;
};

const updateFeeds = (feeds) => {
  const ulOfFeeds = document.createElement('ul');
  ulOfFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  const listOfFeeds = feeds.map((feed) => {
    const newLi = document.createElement('li');
    newLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    newLi.append(h3);
    newLi.append(p);
    return newLi;
  });
  ulOfFeeds.replaceChildren(...listOfFeeds);
  return ulOfFeeds;
};

const updatePosts = (posts, readenPosts) => {
  const ulOfPosts = document.createElement('ul');
  ulOfPosts.classList.add('list-group', 'border-0', 'rounded-0');
  const listOfPosts = posts.flat().map((post) => {
    const newLi = document.createElement('li');
    newLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    if (readenPosts.includes(post.id)) {
      a.classList.add('fw-normal');
    } else {
      a.classList.add('fw-bold');
    }
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.id = post.id;
    a.textContent = post.title;
    a.href = post.link;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.type = 'button';
    button.textContent = 'Просмотр';
    newLi.append(a);
    newLi.append(button);
    return newLi;
  });
  ulOfPosts.replaceChildren(...listOfPosts);
  return ulOfPosts;
};

const makeIfValid = (input, feedback, i18n) => {
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('others.success');
};

const makeIfInvalid = (input, feedback, value, i18n) => {
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18n.t(value);
};

const input = document.querySelector('.form-control');
const feedback = document.querySelector('.feedback');
const feedsEl = document.querySelector('.feeds');
const postsEl = document.querySelector('.posts');

const watch = (state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'feeds':
        makeIfValid(input, feedback, i18n);
        feedsEl.replaceChildren(constructNewCard('Фиды', updateFeeds(value)));
        break;
      case 'posts':
        const readenPosts = state.uiState.readenPosts;
        postsEl.replaceChildren(constructNewCard('Посты', updatePosts(value, readenPosts)));
        break;
      case 'error':
        makeIfInvalid(input, feedback, value, i18n);
        break;
      case 'uiState.activePost':
        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');
        modalTitle.textContent = value.title;
        modalBody.textContent = value.description;
        break;
      case 'uiState.readenPosts':
        const titles = document.querySelectorAll('a');
        titles.forEach((title) => {
          if (value.includes(title.dataset.id)) {
            title.classList.remove('fw-bold');
            title.classList.add('fw-normal');
          }
        });
        break;
      default:
        throw new Error('Unexpected path');
    }
  });
  return watchedState;
};

export default watch;
