let openedNewGame = false;

localStorage.setItem('nyt-wordle-state', '');

const appObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.addedNodes && mutation.addedNodes[0].tagName === 'GAME-APP') {
      appObserver.disconnect();
      loadPlayAgainButton();
      return;
    }
  }
});

appObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

function loadPlayAgainButton () {
  const modal = document.querySelector('game-app').shadowRoot.querySelector('game-modal');
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'open' && mutation.target.getAttribute('open') === '' && mutation.target.querySelector('game-stats')) {
        const countdown = mutation.target.querySelector('game-stats').shadowRoot.querySelector('.countdown');
        while (countdown.firstChild)
          countdown.removeChild(countdown.firstChild);
      
        const button = document.createElement('button');
        button.textContent = 'PLAY AGAIN';
        Object.assign(button.style, {
          'background-color': 'rgb(106, 170, 100)',
          'color': 'white',
          'font-family': 'inherit',
          'font-weight': 'bold',
          'border-radius': '4px',
          'cursor': 'pointer',
          'border': 'none',
          'user-select': 'none',
          'display': 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'text-transform': 'uppercase',
          '-webkit-tap-highlight-color': 'rgba(0,0,0,0.3)',
          'width': '80%',
          'font-size': '20px',
          'height': '52px',
          'margin-left': '20px',
        });
        countdown.appendChild(button);

        button.addEventListener('click', () => {
          observer.disconnect();
          document.body.removeChild(document.querySelector('game-app'));

          /*
          const darkmode = localStorage.getItem('nyt-wordle-darkmode');
          const cbmode = localStorage.getItem('nyt-wordle-cbmode');
          */
          localStorage.setItem('nyt-wordle-state', '');

          openedNewGame = true;
          document.body.appendChild(new window.wordle.bundle.GameApp());

          /*
          const themeManager = document.querySelector('game-app').shadowRoot.querySelector('game-theme-manager');
          if (darkmode === 'true')
            themeManager.setDarkTheme(true);
          
          if (cbmode === 'true')
            themeManager.setColorBlindTheme(true);
          */

          const newModal = document.querySelector('game-app').shadowRoot.querySelector('game-modal');
          observer.observe(newModal, { attributes: true });
        });
      } else if (mutation.attributeName === 'open' && mutation.target.getAttribute('open') === '' && mutation.target.querySelector('game-help') && openedNewGame) {
        mutation.target.removeAttribute('open');
        mutation.target.removeChild(mutation.target.querySelector('game-help'));
      }
    }
  });

  observer.observe(modal, { attributes: true });
}
