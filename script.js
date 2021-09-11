'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const header = document.querySelector('.header');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const navBar = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');
const tabsContent = document.querySelectorAll('.operations__content');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////////////
// ***** Open Account Popup Modal *****
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////
// ***** Learn Button --> Smooth Scroll Animation *****
learnMoreBtn.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
  console.log(`LUL`);
});

///////////////////////////////////////////////
// ***** Nav Bar Links --> Smooth Scroll Animation (Event Delegation) *****

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

///////////////////////////////////////////////
// ***** Nav Bar links - Hover Fade out/in Animation (Event Delegation) *****

const handleHover = function (event, opacityValue) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(element => {
      // lets us change the color of all the elements except the one we are hovering over.
      if (element !== link) element.style.opacity = opacityValue;
    });
    logo.style.opacity = opacityValue;
  }
};

// 'mouseenter' does NOT BUBBLE, while 'mouseover' does bubble.
navBar.addEventListener('mouseover', function (event) {
  handleHover(event, 0.5);
});

// 'mouseleave' does NOT BUBBLE, while 'mouseout' does bubble.
navBar.addEventListener('mouseout', function (event) {
  handleHover(event, 1);
});

///////////////////////////////////////////////
// ***** Nav Bar Stick to top on Scroll feature (Sticky Navigation) using Intersection Observer API *****

const navBarHeight = navBar.getBoundingClientRect().height;

// Observer Call-Back function
const headerObsCallBack = function (entries) {
  // dont need to loop over 'entries' since we only have one entry/'threshold'.
  const [entry] = entries;

  if (!entry.isIntersecting) {
    navBar.classList.add('sticky');
  } else {
    navBar.classList.remove('sticky');
  }
};

// Observer Options Object
const headerObsOptions = {
  root: null, // means observe our target element ('header') as it intersects the current viewport.
  threshold: 0,
  rootMargin: `${-navBarHeight}px`, // the Call-Back function will trigger 'navBarHeight' distance BEFORE the threshold is reached
};

const headerObserver = new IntersectionObserver(
  headerObsCallBack,
  headerObsOptions
);

headerObserver.observe(header); // change this argument to whatever the target is.

///////////////////////////////////////////////
// ***** Reveals Sections as we scroll down --> using Intersection Observer API *****

const allSections = document.querySelectorAll('.section');

const sectionObsCallBack = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.target); // the elements that we intersected

  // called Guard Clause
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // prevents observer from observing the current revealed section after it is revealed. [better for performance]
  observer.unobserve(entry.target);
};

const sectionObsOptions = {
  root: null,
  threshold: 0.15, // greater than '0' because we dont want to show the section right as it enters the viewport, but a little bit later. Section will be revealed only when it is 15 percent visible.
};

const sectionObserver = new IntersectionObserver(
  sectionObsCallBack,
  sectionObsOptions
);

allSections.forEach(section => {
  section.classList.add('section--hidden'); // change if necessary
  sectionObserver.observe(section); // change if necessary
});

///////////////////////////////////////////////
// ***** Lazy Loading Images --> using Intersection Observer API *****

// 'img[data-src]' is a HTML feature that lets us select all the images that has the attribute 'data-src'. Could have also used the '.features__img' class which is available on the needed images only.
const featuredImages = document.querySelectorAll('img[data-src]');

const imagesObsCallBack = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // Guard Clause
  if (!entry.isIntersecting) return;
  // console.log(entry.target);

  // Replace 'src' with 'data-src'
  entry.target.setAttribute('src', entry.target.dataset.src);

  // [ALWAYS USE 'load' event WHEN IMPLEMENTING 'LAZY LOADING IMAGES' strategy]
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // stops observing after replacing and removing css filter class
  observer.unobserve(entry.target);
};

const imagesObsOptions = {
  root: null,
  threshold: 1,
};

const imagesObserver = new IntersectionObserver(
  imagesObsCallBack,
  imagesObsOptions
);

featuredImages.forEach(image => imagesObserver.observe(image)); // change if necessary;

///////////////////////////////////////////////
// ***** Tab Component (Event Delegation) *****

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');

tabsContainer.addEventListener('click', function (event) {
  const clickedBtn = event.target.closest('.operations__tab');

  // removes/clears the 'operations__tab--active' class from ALL the tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  if (!clickedBtn) return;

  // adds the 'operations__tab--active' class to the clicked tab
  clickedBtn.classList.add('operations__tab--active');

  // removes the 'operations__content--active' class from ALL the tabs content elements
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  // adds the 'operations__content--active' class to the content element the corresponds to the clicked tab
  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////
// ***** Slider Component *****

// A function that contains all the slider functionality
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');

  const dotsContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxNumSlides = slides.length - 1;

  // Functionality functions 👇
  // controls the position of each slide
  const goToSlide = function (currentSlide) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
    );
  };

  // Creates dots elements depending on how many slides we have.
  const createDots = function () {
    // '_slide' underscore before 'slide' is a convention of a Throw Away variable --> a variable that we dont need.
    slides.forEach((_slide, i) =>
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="dots__dot" data-slide="${i}"></div>`
      )
    );
  };

  // highlights current ACTIVE dot that corresponds to the currentSlide.
  const activateDot = function (currentSlide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      // removes the 'dots__dot--active' from all dot elements
      dot.classList.remove('dots__dot--active');

      // adds 'dots__dot--active' class to the currentSlide [Hardest part]
      document
        .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
        .classList.add('dots__dot--active');
    });
  };

  // moves slides right
  const nextSlide = function () {
    if (currentSlide === maxNumSlides) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // moves slides left
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxNumSlides;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Initializing Slider as page loads 👇
  const init = function () {
    // changes the positions of the slides to make them next to each other at the start
    goToSlide(currentSlide);

    // creates the dots elements depending on how many slides we have
    createDots();

    // highlights the current slide
    activateDot(0);
  };

  init();

  /// EVENT HANDLERS 👇

  // 🟠 Move Slider on click
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // 🔵 Move Slider using keyboard
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      prevSlide();
    }

    /// ⭐⭐ can also use short-circuiting to fdo the same thing
    // event.key === 'ArrowRight' && nextSlide();
    // event.key === 'ArrowLeft' && prevSlide();
  });

  // 🟢 Highlights and goes to corresponding slide, when a dot is clicked (Event delegation)
  dotsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      const clickedDot = event.target.dataset.slide;
      // got to corresponding clicked dot
      goToSlide(clickedDot);
      // highlights clicked dot
      activateDot(clickedDot);
    }
  });
};

slider();

///////////////////////////////////////////////
// ***** Cookie Message *****
// const message = document.createElement('div');
// message.classList.add('cookie-message'); // add the 'cookie-message' class to 'msg' DOM element
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it! 👍</button>';

// // inserts the 'message' element into the DOM
// header.append(message);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
