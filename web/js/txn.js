'use strict';

Parse.initialize("eYl06p1bCOWl7oInD4z6MTtNuNJGkAeC8vRWMB3b", "WMyuYm1Wmb9NtbzkgNQdq1UyYZfeOQJ5ZDVhRLme");

var Transaction = Parse.Object.extend("Transaction");
var Listing = Parse.Object.extend("Listing");

var txn_id;
if (!document.location.search || document.location.search.length < 2) {
  alert('Invalid transaction id.');
} else {
  txn_id = document.location.search.slice(1);
  load_txn();
}

var global_txn;

function load_txn() {
  var q = new Parse.Query(Transaction);
  console.log('Querying', txn_id);
  q.get(txn_id, {
    success: function(txn) {
      global_txn = txn;
      if (txn.attributes.state != 'PENDING_APPROVAL') {
        alert('Error: Can\'t ask for approval.  Transaction state is ' + txn.attributes.state);
        return;

      }
      var q2 = new Parse.Query(Listing);
      q2.get(txn.attributes.listing.id, {
        success: function(listing) {
          $(function() {
            $('#info').html(tmpl('txn_info_tmpl', {
              txn: txn,
              listing: listing
            }));
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
        state: 'PENDING_MEETUP'
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
  var txn = new Transaction();
  txn.save({
    id: txn_id,
    state: 'REJECTED'
  }, {
    success: function() {
      alert('The request has been rejected.');
      // TODO send rejection SMS
    },
    error: function(obj, err) {
      alert("Error :( " + err.message);
    }
  });

  return false;

  return false;
}

$(function() {
  $('#accept_request').on('click', accept_request);
  $('#reject_request').on('click', reject_request);
});
