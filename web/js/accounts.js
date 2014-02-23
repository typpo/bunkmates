'use strict';

var User = Parse.Object.extend("User", {
  listings: 0,
  transactions: 0,
  reviewed_count: 0,
  reviews: []
});

var Listing = Parse.Object.extend("Listing");
var Transaction = Parse.Object.extend("Transaction");
var Review = Parse.Object.extend("Review");
var to_be_reviewed = [];
if (Parse.User.current())
  load_reviews();

function fblogin(cb) {
  Parse.FacebookUtils.logIn('email, user_friends', {
    success: function(user) {
      load_reviews()
      if (!user.existed()) {
        //alert("User signed up and logged in through Facebook!");
        cb && cb(true);
      } else {
        cb && cb(true);
      }
    },
    error: function(user, error) {
      alert("Could not fully authorize you.  We require Facebook accounts to make sure you're not creepy.");
    }
  });
}

function load_reviews() {
  to_be_reviewed = [];
  var user = Parse.User.current();
  // this went very wrong, we should also redirect
  if (!user || !Transaction || !Listing) return;
  var transactions = new Parse.Query(Transaction)
  var listings = new Parse.Query(Listing);
  transactions.equalTo('user', user);
  transactions.equalTo('state', 'COMPLETE');
  transactions.equalTo('reviewed', false);
  listings.equalTo('user', user);
  listings.equalTo('state', 'COMPLETE');
  listings.equalTo('reviewed', false);
  // ewww
  transactions.find({
    success: function(results) {
      listings.find({
        success: function(results) {
          for (var i in results) {
            var guest = results[i].guest;
            if (guest)
              to_be_reviewed.push(results[i]);
          }
          if (!to_be_reviewed.length) return;
          $('#please_review').removeClass('hidden');
          var html = [];
          for (var r in to_be_reviewed) {
            html.push(to_be_reviewed[r] + '');
          }
          $('#list_of_users').html(html.join(''));
        }
      });
      for (var i in results) {
        var host = results[i].listing.user;
        to_be_reviewed.push(host);
      }
    }
  });
}
