'use strict';

Parse.initialize("eYl06p1bCOWl7oInD4z6MTtNuNJGkAeC8vRWMB3b", "WMyuYm1Wmb9NtbzkgNQdq1UyYZfeOQJ5ZDVhRLme");

var fb_init_fns = [];
window.fbAsyncInit = function() {
  for (var i=0; i < fb_init_fns.length; ++i) {
    fb_init_fns[i]();
  }
}
fb_init_fns.push(function() {
  console.log('fbasync init');
  // Nav setup
  new FastClick(document.body);
  Parse.FacebookUtils.init({
    appId      : '586631808094294', // Facebook App ID
    //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow Parse to access the session
    xfbml      : true  // parse XFBML
  });
});

$(function() {
  $(window).on('hashchange', runhash);

  function runhash() {
    console.log('Hash changed');
    var $current = $('.slide-fixed');
    $('.slide').addClass('hidden');
    $('.slide').removeClass('slide-animate');
    $('#go_home').hide();
    //$('.slide').removeClass('slide-out');
    window.scrollTo(0, 0); // reset scroll
    var hash = window.location.hash;
    var query = '';
    if (hash.indexOf('?') > -1) {
      var sp = hash.split('?');
      hash = sp[0];
      query = sp[1];
    }
    var $slide;
    switch (hash) {
      case "#add":
        $slide = $('#add_listing');
        $slide.removeClass('hidden');
        $slide.addClass('slide-animate');
        $('#go_home').show();
        break;
      case "#listing":
        $slide = $('#listing');
        load_listing(query);
        $slide.removeClass('hidden');
        $slide.addClass('slide-animate');
        $('#go_home').show();
        break;
      case "#reviews":
        $slide = $('#reviews');
        $slide.removeClass('hidden');
        $slide.addClass('slide-animate');
        $('#go_home').show();
        break;
      default:
        get_all_listings();
        $slide = $('#listings');
        $slide.removeClass('hidden');
        $slide.addClass('slide-animate');
        break;
    }
    /*
    $current.addClass('slide-out');
    $current.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $(this).addClass('hidden');
        $(this).addClass('slide');
        $(this).removeClass("slide-out");
        $(this).removeClass("slide-fixed");
    });
    $slide.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $(this).addClass('slide-fixed');
        //$(this).removeClass("slide-animate");
        //$(this).removeClass('slide');
    });
    */
  }
  get_all_listings(runhash);

  /**************** Bind all actions here **************/
  $('#login').on('click', fblogin);
  $('#create_new_listing').on('click', function() {
    window.location.hash = '#add';
  });
  $('#submit_listing').on('click', function() {
    submit_listing();
  });
  $('#submit_request').on('click', function() {
    submit_request();
  });
  $('#hotel_name').on('keyup', function() {
    hotel_input();
  });
  $('#listings').on('click', 'div.listing', function() {
    var $list = $(this);
    window.location.hash = 'listing?' + $list.data('listing-id');
  });

  window.gmaps_initialize = function() {
    var autocomplete = new google.maps.places.Autocomplete($('#places_auto')[0]);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        alert('can\'t geocode this place :(');
        return;
      }
      filter_results(place.geometry.location);
    });
  }
});
