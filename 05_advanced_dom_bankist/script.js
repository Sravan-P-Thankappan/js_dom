'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => {
    btn.addEventListener('click', openModal);
})
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// event propagation
/* 
instead of adding smooth scroll to all nav_links we use event propagation (bubbling phase)
added listner to parent nav_links
then click on our target nav_links generate event on child which also goes to it's outer most parent trough all it's parent.
we listend event in nav_links parent.
the target element will be where the event originates.

*/

navLinks.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target;
    // we can use this to refere target element.
    if (target.classList.contains('nav__link')) {
        const sectionId = target.getAttribute('href'); // or we can use this.getAttribute() , here this => target element
        document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
    }
    // if condition is to make sure to apply smooth scroll only when click on <a> tag. w
})


// tabbed conponent

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
tabContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;
    tabs.forEach((t) => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    tabsContent.forEach(oc => oc.classList.remove('operations__content--active'));

    document.querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');

    /* 
    we can add custom data as an attribute to html element by data-*
    eg:data-tab.
    to access this element.dataset.tab(the name after data-)

    also we can add attribute without specifiying data-
    this can accessed by getAttribute()
    eg: <p hello='Hello'>I am a paragraph</p> element.getAttribute('hello')
    */

})


// Smooth scrolling
btnScrollTo.addEventListener('click', (e) => {
    const s1coords = section1.getBoundingClientRect();

    // window.scrollTo(s1coords.left + window.scrollX, s1coords.top + window.scrollY)

    // window.scrollTo({
    //     left:s1coords.left + window.scrollX,
    //     top:s1coords.top + window.scrollY,
    //     behavior:'smooth'
    // });

    // work only on modern browser.
    section1.scrollIntoView({ behavior: 'smooth' })

    // console.log(s1coords);
    // console.log("current scroll", window.scrollY)

    /* 
    window.scrollY : how much we scrolled down from view port

    document.documentElement.clientWidth: This property refers to the width of the viewport (the visible area of the document) excluding scrollbars.

    windo.innerWidth: This property represents the viewport width including any scrollbars (if visible).
    both are have difference in value.

    windo.innerHeight and  document.documentElement.clientHeight
    it's values are same almost every time.
    */
});


//---------------- menu fade animation ---------------
const handleOver = (e, opacity) => {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');
        siblings.forEach((e) => {
            if (e !== link) {
                e.style.opacity = opacity;
            }
        });
        logo.style.opacity = opacity;
    }
}
nav.addEventListener('mouseover', (e) => {
    handleOver(e, 0.5);
});

nav.addEventListener('mouseout', (e) => {
    handleOver(e, 1);
});


// ------------Sticky navigation---------------------
/* window.addEventListener('scroll', () => {
    const intialCord = section1.getBoundingClientRect();
    if (window.scrollY > intialCord.top) nav.classList.add('sticky')
    else nav.classList.remove('sticky');
}); */

// using observer api
/* const obsCallback = function (entries,observer){
        console.log(entries);
}

const obsOptions = {
    root:null,
    threshold:[0,0.2]
}
const observer = new IntersectionObserver(obsCallback,obsOptions);
observer.observe(section1); */


const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: '-90px' // will apply a margin to the target element from the bottom here it is header.
    // positive applies outwards from bottom and negative applies inwards from bottom.
    // here 90 is height of the nav we can give it by nav.getBoundingClientRec().height
});

headerObserver.observe(header)

// reveal section
const sections = document.querySelectorAll('.section')
const revealSection = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry)
    if (entry.isIntersecting) {
        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    }
}
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});

sections.forEach((section) => {
    sectionObserver.observe(section);
    // section.classList.add('section--hidden');
})

// image lazy loading

const images = document.querySelectorAll('img[data-src]');

const lazyLoading = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry)
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    })
}

const imgObserver = new IntersectionObserver(lazyLoading, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
})

images.forEach((img) => {
    imgObserver.observe(img);
})


// slider
const slides = document.querySelectorAll('.slide');
// const slider = document.querySelector('.slider');
const leftBtn = document.querySelector('.slider__btn--left');
const rightBtn = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
let currentSlide = 0;
const maxSlide = slides.length;

const moveSlide = function (slide) {
    slides.forEach((s, i) => {
        s.style.transform = `translateX(${(i - slide) * 100}%)`;

    });
}

const createDots = function () {
    slides.forEach((s, i) => {
        dotContainer.insertAdjacentHTML('beforeend', `
            <button class="dots__dot" data-slide=${i}></button>
            `);
    })
}

const dotActive = function (slide) {
    document.querySelectorAll('.dots__dot').forEach((d) => {
        d.classList.remove('dots__dot--active');
    });

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
}



const nextSlide = function () {
    if (currentSlide === maxSlide - 1) currentSlide = 0;
    else currentSlide++;
    moveSlide(currentSlide);
    dotActive(currentSlide);
}

const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide - 1;
    else currentSlide--
    moveSlide(currentSlide);
    dotActive(currentSlide);
}

rightBtn.addEventListener('click', nextSlide);
leftBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

dotContainer.addEventListener('click', (e) => {
    console.log(e.target)
    if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        moveSlide(slide);
        dotActive(slide);
        currentSlide = slide;
    }
});

function init() {
    moveSlide(0);
    createDots();
    dotActive(0);
}

init();

/* 

1.-------------------Selecting Element----------------
document.documentElement

querySelector()
querySelectorAll()
getElementById()
getElementByClassName()
getElementByTagName()


2. -------------------Creating and inserting elements-----------------------

insertAdjacentHTML()


const header = document.querySelector('.header')

const message = document.createElement('div');
message.innerHTML = `We Use Cookkies for improved functionality and analytics. <button class = 'btn btn--close--cookie'>Got It! </button>`;
// header.prepend(message); // add as first child.

header.append(message);  // add as last child.

document.querySelector('.btn--close--cookie').addEventListener('click',()=>{
   message.remove();  //delete an element
});

*/

/* 
remove events
const h1 = document.querySelector('h1')
const alertE = ()=>{
    alert('Hello Welcome');
    h1.removeEventListener('mouseenter',alertE)
}

h1.addEventListener('mouseenter',alertE) 


--------------------Note-------------------------
NodeList => retrun by querySelectorAll() and element.childNodes;
we can iterate over node using for loops (for(), and for of) and also by forEach method.
for using array meathod we have to convert it into array using spread or Array.from();
only forEach array method work in NodeList

HtmlCollection => return by getElementByClassName() and element.children
we can iterate over node using for loops (for(), and for of)

but forEach and other array method won't work. for using array methods need to convert it into array using spread or Array.from()



//3. --------------------------Dom traversing------------------------------------.
const h1 = document.querySelector('h1')


// console.log(h1.querySelectorAll('.highlight'))
// ----------------- Downwards --------
// console.log(h1.childNodes)
// console.log(h1.children)
// console.log(h1.firstElementChild)
// h1.firstElementChild.style.color = 'white'
// console.log(h1.lastElementChild)

// ---------- upwards -----------
console.log(h1.parentElement) // returns only nearest parent

h1.closest('.header') // returns the closest parent having the specified classSelector (any selector). it go upwards until it find that elemet
// with selector. closest will traverse upwards until the html element. if it is not found return null.
//  closest will begin from the element itself. so it first check the starting element satisfies the condition.

// --------- side ways ------------
h1.previousElementSibling
h1.nextElementSibling
// to find all the sibling and the element itself
h1.parentElement.children

*/


