function fblogin(cb) {
  Parse.FacebookUtils.logIn('email', {
    success: function(user) {
      if (!user.existed()) {
        alert("User signed up and logged in through Facebook!");
        cb(false);
      } else {
        cb(true);
      }
    },
    error: function(user, error) {
      alert("User cancelled the Facebook login or did not fully authorize.");
    }
  });
}
