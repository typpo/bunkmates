'use strict';

Parse.initialize("eYl06p1bCOWl7oInD4z6MTtNuNJGkAeC8vRWMB3b", "WMyuYm1Wmb9NtbzkgNQdq1UyYZfeOQJ5ZDVhRLme");

window.fbAsyncInit = function() {
  // Nav setup
  new FastClick(document.body);
  Parse.FacebookUtils.init({
    appId      : '586631808094294', // Facebook App ID
    //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow Parse to access the session
    xfbml      : true  // parse XFBML
  });
};

$(function() {
  $(window).on('hashchange', runhash);

  function runhash() {
    console.log('Hash changed');
    $('.slide').addClass('hidden');
    var hash = window.location.hash;
    var query = '';
    if (hash.indexOf('?') > -1) {
      var sp = hash.split('?');
      hash = sp[0];
      query = sp[1];
    }
    switch (hash) {
      case "#add":
        $('#add_listing').removeClass('hidden');
        break;
      case "#listing":
        $('#listing').removeClass('hidden');
        load_listing(query);
        break;
      case "#reviews":
        $('#reviews').removeClass('hidden');
        break;
      default:
        get_all_listings();
        $('#listings').removeClass('hidden');
        break;
    }
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
  var autocomplete = new google.maps.places.Autocomplete($('#places_auto')[0]);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      alert('can\'t geocode this place :(');
      return;
    }
    filter_results(place.geometry.location);
  });
});
