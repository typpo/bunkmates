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
  var slider = new PageSlider($("#container"));
  $(window).on('hashchange', route);

  // Basic page routing
  function route(event) {
      var page,
          hash = window.location.hash;

      if (hash === "#add") {
        page = document.getElementById('add_listing').innerHTML;

  //        slider.slide($(page), "right");
      } else {
        page = document.getElementById('main').innerHTML;
  //        slider.slide($(homePage), "left");
      }

      slider.slidePage($(page));

  }

  Parse.FacebookUtils.init({
    appId      : '586631808094294', // Facebook App ID
    //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow Parse to access the session
    xfbml      : true  // parse XFBML
  });

  /**************** Bind all actions here **************/
  $('#login').on('click', fblogin);


};
