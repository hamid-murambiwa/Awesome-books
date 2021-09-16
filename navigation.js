const links = document.querySelectorAll('.link');

links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.active').classList.remove('active');
    link.classList.add('active');
    const id = link.getAttribute('href').slice('1');

    const currentSection = document.querySelector('.active-page');
    if (currentSection) {
      currentSection.classList.remove('active-page');
    }
    const section = document.getElementById(id);
    if (section) {
      section.classList.add('active-page');
    }
  });
});