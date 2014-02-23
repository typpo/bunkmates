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

function load_txn(txn_id) {
  var q = new Parse.Query(Transaction);
  q.get(txn_id, {
    success: function(txn) {
      $(function() {
        $('#info').html(tmpl('txn_info_tmpl', {
          txn: txn
        }));
      });
    },
    error: function(obj, err) {
      alert(err.message);
    }
  });
}

function accept_request() {
  var txn = new Transaction();
  txn.save({
    id: txn_id,
    state: 'PENDING_MEETUP'
  }, {
    success: function() {
      alert('You got it!  Your guest has been notified.');
    },
    error: function(obj, err) {
      alert("Error :( " + err.message);
    }
  });

  return false;
}

function reject_request() {
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
  });

  return false;

  return false;
}

$(function() {
  $('#accept_request').on('click', accept_request);
  $('#reject_request').on('click', reject_request);
});
