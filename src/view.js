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
  mainDiv.append(innerDiv, ulEl);
  return mainDiv;
};

const createFeedsEl = (feeds) => {
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
    newLi.append(h3, p);
    return newLi;
  });
  ulOfFeeds.replaceChildren(...listOfFeeds);
  return ulOfFeeds;
};

const createPostsEl = (posts, readenPosts) => {
  const ulOfPosts = document.createElement('ul');
  ulOfPosts.classList.add('list-group', 'border-0', 'rounded-0');
  const listOfPosts = posts.map((post) => {
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
    newLi.append(a, button);
    return newLi;
  });
  ulOfPosts.replaceChildren(...listOfPosts);
  return ulOfPosts;
};

const makeIfValid = (input, feedback, i18n) => {
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('feedbackTexts.success');
};

const makeIfInvalid = (input, feedback, value, i18n) => {
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18n.t(value);
};

const watch = (state, i18n, domElements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'feeds':
        makeIfValid(domElements.input, domElements.feedback, i18n);
        domElements.feedsEl.replaceChildren(constructNewCard(i18n.t('interfaceTexts.feeds'), createFeedsEl(value)));
        break;
      case 'posts':
        domElements.postsEl.replaceChildren(constructNewCard(i18n.t('interfaceTexts.posts'), createPostsEl(value, state.uiState.readenPosts)));
        break;
      case 'error':
        makeIfInvalid(domElements.input, domElements.feedback, value, i18n);
        break;
      case 'uiState.activePost':
        domElements.modalTitle.textContent = value.title;
        domElements.modalBody.textContent = value.description;
        break;
      case 'uiState.readenPosts':
        domElements.links().forEach((title) => {
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
