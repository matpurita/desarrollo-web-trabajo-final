$(document).ready(function() {
    $('#menu-toggle').click(function() {
      $('#menu').toggleClass('show');
    });

    $(window).resize(function() {
      if ($(window).width() > 985) {
        $('#menu').removeClass('show');
      }
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > 30) {
          $('#scrollToTopBtn').fadeIn();
        } else {
          $('#scrollToTopBtn').fadeOut();
        }
      });
    
      // Subir hasta arriba cuando se hace clic en el botón
      $('#scrollToTopBtn').click(function() {
        $('html, body').animate({ scrollTop: 0 }, '300');
        return false;
      });
    
  });