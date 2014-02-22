Parse.initialize("eYl06p1bCOWl7oInD4z6MTtNuNJGkAeC8vRWMB3b", "WMyuYm1Wmb9NtbzkgNQdq1UyYZfeOQJ5ZDVhRLme");

/*
var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
  testObject.save({foo: "bar"}, {
  success: function(object) {
    $(".success").show();
  },
  error: function(model, error) {
    $(".error").show();
  }
});
*/
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
    switch (window.location.hash) {
      case "#add":
        console.log('switching to add');
        $('#add_listing').removeClass('hidden');
        break;
      default:
        $('#listings').removeClass('hidden');
        break;
    }
  }
  runhash();

  /**************** Bind all actions here **************/
  $('#login').on('click', fblogin);
  $('#add_listing').on('click', function() {
    window.location.hash = '#add';
  });
  $('#submit_listing').on('click', submit_listing);
});
