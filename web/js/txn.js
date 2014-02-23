'use strict';

Parse.initialize("eYl06p1bCOWl7oInD4z6MTtNuNJGkAeC8vRWMB3b", "WMyuYm1Wmb9NtbzkgNQdq1UyYZfeOQJ5ZDVhRLme");

var Transaction = Parse.Object.extend("Transaction");

if (!document.location.search || document.location.search.length < 2) {
  alert('Invalid transaction id.');
} else {
  load_txn(document.location.search.slice(1));
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
