/* toggles the "inverted" class on the stage whenever the login box is hovered,
   which triggers the smooth background-color transition defined in the CSS */
const stage = document.getElementById('stage');
const loginBox = document.getElementById('loginBox');

loginBox.addEventListener('mouseenter', () => {
  stage.classList.add('inverted');
});

loginBox.addEventListener('mouseleave', () => {
  stage.classList.remove('inverted');
});