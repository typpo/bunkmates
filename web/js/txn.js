'use strict';

Parse.initialize("eYl06p1bCOWl7oInD4z6MTtNuNJGkAeC8vRWMB3b", "WMyuYm1Wmb9NtbzkgNQdq1UyYZfeOQJ5ZDVhRLme");

var Transaction = Parse.Object.extend("Transaction");
var Listing = Parse.Object.extend("Listing");
var Review = Parse.Object.extend("Review");

var txn_id;
if (!document.location.search || document.location.search.length < 2) {
  alert('Invalid transaction id.');
} else {
  txn_id = document.location.search.slice(1);
  load_txn();
}

var global_txn;
var global_listing;

function load_txn() {
  var q = new Parse.Query(Transaction);
  console.log('Querying', txn_id);
  q.get(txn_id, {
    success: function(txn) {
      global_txn = txn;
      var q2 = new Parse.Query(Listing);
      q2.get(txn.attributes.listing.id, {
        success: function(listing) {
          global_listing = listing;
          $(function() {
            if (txn.attributes.state == 'CONFIRMED') {
              $('#info').html(tmpl('txn_review_tmpl', {
                txn: txn,
                listing: listing
              }));
              $('.submit_review_container').removeClass('hidden');
            } else if (txn.attributes.state == 'PENDING_APPROVAL') {
              $('#info').html(tmpl('txn_info_tmpl', {
                txn: txn,
                listing: listing
              }));
              $('.accept_reject').removeClass('hidden');
            } else {
              alert('Error: Can\'t ask for approval.  Transaction state is ' + txn.attributes.state);
            }
          });
        },
        error: function(obj, err) {
          console.log(obj, err);
          alert('Error loading your transaction: ' + err.message);
        }
      });
    },
    error: function(obj, err) {
      console.log(obj, err);
      alert('Error loading your transaction: ' + err.message);
    }
  });
}

function accept_request() {
  $('.accept_reject').hide();
  // Send SMS
  var listing_id = global_txn.attributes.listing.id;
  var txn_attr = global_txn.attributes;
  Parse.Cloud.run('sendMeetupInfo', {
    // Stupid parse workaround
    txn: {
      guest_name: txn_attr.guest_name,
      guest_phone: txn_attr.guest_phone
    },
    // TODO this can be cleaned up now that we have to look up this listing
    // on the frontend anyway.
    listing_id: listing_id
  }, {
    success: function(result) {
      var txn = new Transaction();
      txn.save({
        id: txn_id,
        //state: 'PENDING_MEETUP'
        state: 'CONFIRMED'
      }, {
        success: function() {
          alert('You got it!  Your guest has been notified and your listing has been removed.');
          // TODO update listing with guest and set state to 'CLOSED'
        },
        error: function(obj, err) {
          console.log(obj, err);
          alert("Error :( " + err.message);
        }
      });
    },
    error: function(err) {
      console.log(arguments);
      alert('Sorry, sending text failed. ' + err.message);
    }
  });

  return false;
}

function reject_request() {
  $('.accept_reject').hide();
  Parse.Cloud.run('sendRejection', {
    // Stupid parse workaround
    listing: {
      host_name: global_listing.attributes.host_name
    },
    txn: {
      guest_name: global_txn.attributes.guest_name,
      guest_phone: global_txn.attributes.guest_phone
    }
  }, {
    success: function() {
      var txn = new Transaction();
      txn.save({
        id: txn_id,
        state: 'REJECTED'
      }, {
        success: function() {
          alert('The request has been rejected.');
        },
        error: function(obj, err) {
          alert("Error :( " + err.message);
        }
      });  // end txn.save
    },
    error: function(obj, err) {
      console.log(obj, err);
      alert('Error: ' + err.message);
    }
  });
  return false;
}

function submit_review() {
  // Decide who is writing the review
  // FIXME can be spoofed
  var is_host_user = false;
  var this_user = Parse.User.current();
  var host_user = global_listing.attributes.user;
  var guest_user = global_txn.attributes.user;
  if (this_user.id === host_user.id) {
    is_host_user = true;
  } else if (this_user.id !== guest_user.id) {
    alert('You are not logged in as a user on this transaction.');
    fblogin();
    return;
  }

  $('#submit_review').hide();

  // Create a review
  var review = new Review();
  review.save({
    txn: global_txn,
    listing: global_listing,
    author: this_user,
    user_reviewed: is_host_user ? guest_user : host_user,

    stars: parseInt($('form input[name="stars"]:checked').val()),
    review: $('#review_text').val()
  }, {
    success: function(review) {
      alert('Review submitted. Thanks!');
      // TODO mark txn as reviewed
      window.location.href = '/';
    },
    error: function(obj, err) {
      console.log(obj, err);
      alert('Error: ' + err);
    }
  });
}

$(function() {
  $('#accept_request').on('click', accept_request);
  $('#reject_request').on('click', reject_request);
  $('#submit_review').on('click', submit_review);
});
