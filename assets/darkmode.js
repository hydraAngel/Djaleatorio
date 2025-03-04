let darkmode = localStorage.getItem('darkmode');
const darkmodeToggle = document.querySelector('#theme-switch');

const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'enabled');
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', null);
}

if (darkmode === 'enabled') {
  enableDarkmode();
}

darkmodeToggle.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode');
  if (darkmode !== 'enabled') {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
}
);

