'use strict';

function fblogin(cb) {
  Parse.FacebookUtils.logIn('email', {
    success: function(user) {
      if (!user.existed()) {
        //alert("User signed up and logged in through Facebook!");
        cb(true);
      } else {
        cb(true);
      }
    },
    error: function(user, error) {
      alert("Could not fully authorize you.  We require Facebook accounts to make sure you're not creepy.");
    }
  });
}
