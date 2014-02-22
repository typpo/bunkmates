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
    var hash = window.location.hash;
    var query = '';
    if (hash.indexOf('?') > -1) {
      var sp = hash.split('?');
      hash = sp[0];
      query = sp[1];
    }
    switch (hash) {
      case "#add":
        console.log('switching to add');
        $('#add_listing').removeClass('hidden');
        break;
      case "#listing":
        $('#listing').removeClass('hidden');
        load_listing(query);
        break;
      default:
        $('#listings').removeClass('hidden');
        fill_listings();
        break;
    }
  }
  runhash();

  /**************** Bind all actions here **************/
  $('#login').on('click', fblogin);
  $('#create_new_listing').on('click', function() {
    window.location.hash = '#add';
  });
  $('#submit_listing').on('click', function() {
    submit_listing();
  });
  $('#hotel_name').on('keyup', function() {
    hotel_input();
  });
});

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();
