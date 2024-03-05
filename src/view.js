import onChange from 'on-change';

const watch = (state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'state') {
      const input = document.querySelector('.form-control');
      const feedback = document.querySelector('.feedback');
      if (value === 'invalid') {
        input.classList.add('is-invalid');
        feedback.textContent = i18n.t(state.error);
        console.log('hey')
      } else {
        console.log('hello')
        const feeds = document.querySelector('.feeds');
        console.log(feeds)
        const firstDiv = document.createElement('div');
        console.log(firstDiv)
        firstDiv.classList.add('card', 'border-0');
        const secondDiv = document.createElement('div');
        secondDiv.classList.add('card-body');
        const h2 = document.createElement('h2');
        h2.classList.add('card-title', 'h4');
        h2.textContent = 'Фиды';
        secondDiv.append(h2);
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'border-0', 'rounded-0');
        const listOfFeeds = state.feeds;
        listOfFeeds.map((feed) => {
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

        ul.replaceChildren(...listOfFeeds);

        firstDiv.append(secondDiv);
        firstDiv.append(ul);

        feeds.append(firstDiv);

        input.classList.remove('is-invalid');
        feedback.textContent = i18n.t('others.success');
      }
    }
  });
  return watchedState;
};

export default watch;
