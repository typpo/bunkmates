'use strict';

Parse.initialize("eYl06p1bCOWl7oInD4z6MTtNuNJGkAeC8vRWMB3b", "WMyuYm1Wmb9NtbzkgNQdq1UyYZfeOQJ5ZDVhRLme");

var Transaction = Parse.Object.extend("Transaction");

var txn_id;
if (!document.location.search || document.location.search.length < 2) {
  alert('Invalid transaction id.');
} else {
  txn_id = document.location.search.slice(1);
  load_txn();
}

function load_txn() {
  var q = new Parse.Query(Transaction);
  console.log('Querying', txn_id);
  q.get(txn_id, {
    success: function(txn) {
      if (txn.attributes.state != 'PENDING_APPROVAL') {
        alert('Error: Can\'t ask for approval.  Transaction state is ' + txn.attributes.state);
        return;

      }
      $(function() {
        $('#info').html(tmpl('txn_info_tmpl', {
          txn: txn
        }));
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
  var txn = new Transaction();
  txn.save({
    id: txn_id,
    state: 'PENDING_MEETUP'
  }, {
    success: function() {
      alert('You got it!  Your guest has been notified and your listing has been removed.');
      // TODO update listing with guest and set state to 'CLOSED'
      // Send SMS
      Parse.Cloud.run('sendMeetupInfo', {

      }, {
        success: function(result) {
          alert('Your request was sent!');
        },
        error: function(error) {
        }
      });
    },
    error: function(obj, err) {
      console.log(obj, err);
      alert("Error :( " + err.message);
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
