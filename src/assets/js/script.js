/* NAVIGATION */
// COLLAPSE THE NAVBAR BY ADDING THE TOP-NAV-COLLAPSE CLASS
window.onscroll = function () {
    scrollFunction();
    // scrollFunctionBTT();
};

function scrollFunction() {
    let intViewportWidth = window.innerWidth;
    let navbar = document.getElementById("navbar");
    if (navbar) {
        if (
            document.body.scrollTop > 30 ||
            (document.documentElement.scrollTop > 30) & (intViewportWidth > 991)
        ) {
            navbar.classList.add("top-nav-collapse");
        } else if (
            document.body.scrollTop < 30 ||
            (document.documentElement.scrollTop < 30) & (intViewportWidth > 991)
        ) {
            navbar.classList.remove("top-nav-collapse");
        }
    }
}

// NAVBAR ON MOBILE
document.addEventListener("DOMContentLoaded", function () {
    let elements = document.querySelectorAll(".nav-link:not(.dropdown-toggle)");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", () => {
            let offcanvas = document.querySelector(".offcanvas-collapse");
            if (offcanvas) {
                offcanvas.classList.toggle("open");
            }
        });
    }

    let navbarToggler = document.querySelector(".navbar-toggler");
    if (navbarToggler) {
        navbarToggler.addEventListener("click", () => {
            let offcanvas = document.querySelector(".offcanvas-collapse");
            if (offcanvas) {
                offcanvas.classList.toggle("open");
            }
        });
    }

    // HOVER ON DESKTOP
    function toggleDropdown(e) {
        const _d = e.target.closest(".dropdown");
        if (_d) {
            let _m = _d.querySelector(".dropdown-menu");
            if (_m) {
                setTimeout(
                    function () {
                        const shouldOpen = _d.matches(":hover");
                        _m.classList.toggle("show", shouldOpen);
                        _d.classList.toggle("show", shouldOpen);

                        _d.setAttribute("aria-expanded", shouldOpen);
                    },
                    e.type === "mouseleave" ? 300 : 0
                );
            }
        }
    }

    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        dropdown.addEventListener("mouseleave", toggleDropdown);
        dropdown.addEventListener("mouseover", toggleDropdown);
        dropdown.addEventListener("click", (e) => {
            const _d = e.target.closest(".dropdown");
            if (_d) {
                let _m = _d.querySelector(".dropdown-menu");
                if (_d.classList.contains("show")) {
                    _m.classList.remove("show");
                    _d.classList.remove("show");
                } else {
                    _m.classList.add("show");
                    _d.classList.add("show");
                }
            }
        });
    }

    /* CARD SLIDER - SWIPER */
    var cardSlider = new Swiper(".card-slider", {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        slidesPerView: 3,
        spaceBetween: 70,
        breakpoints: {
            // when window is <= 767px
            767: {
                slidesPerView: 1,
            },
            // when window is <= 991px
            991: {
                slidesPerView: 2,
                spaceBetween: 40,
            },
        },
    });

    /* BACK TO TOP BUTTON */
    var myButton = document.getElementById("myBtn");

    // WHEN THE USER SCROLLS DOWN 20PX FROM THE TOP OF THE DOCUMENT, SHOW THE BUTTON
    function scrollFunctionBTT() {
        if (myButton) {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                myButton.style.display = "block";
            } else {
                myButton.style.display = "none";
            }
        }
    }

    // WHEN THE USER CLICKS ON THE BUTTON, SCROLL TO THE TOP OF THE DOCUMENT
    if (myButton) {
        myButton.addEventListener("click", function () {
            document.body.scrollTop = 0; // for Safari
            document.documentElement.scrollTop = 0; // for Chrome, Firefox, IE and Opera
        });
    }

    // AOS ANIMATION ON SCROLL
    AOS.init({
        duration: 1000,
        easing: "ease",
        once: true, 
    });
});

function allowOnlyNumbers(input) {
    const regex = /^[0-9]+$/;
    return regex.test(input);
}

function validateNumberInput(element) {
    if (!allowOnlyNumbers(element.value)) {
        element.value = element.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    }
}
