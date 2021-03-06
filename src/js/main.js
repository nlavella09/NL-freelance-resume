//NL-static-build-process 0.9.0

//load functions
$(document).ready(function() {
  $(".chase").each(function() {
    //if scrolled into view and not already activated
    if (!$(this).hasClass("active")) {
      //mark as activated
      $(this).addClass("active");
      chase(this, $(this).attr("data-chase-speed"));
    }
  });
});

//scroll functions
$(window).scroll(function() {});

//resize functions
$(window).resize(function() {});

var swiper = new Swiper(".swiper-container", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination"
  }
});
