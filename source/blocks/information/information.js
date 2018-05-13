$('.information__button-link').on('click', function() {
    var scrollT = $('.video').position();
    var body = $("html, body");
    body.stop().animate({scrollTop:scrollT.top}, 500, 'swing');
});