var client = require('twilio')('AC7b5178b4fe2c349a8fa476ccb6c51e25', '35de62cdf391327193a38065b7b1a273');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

function formatPhone(n) {
  var ret = n.replace(/[^\d\+]/g, '');
  if (ret.indexOf('+1') != 0) {
    ret = '+1' + ret;
  }
  return ret;
}

Parse.Cloud.define('sendRequest', function(request, response) {
  console.log(request.params);
  client.sendSms({
      to: formatPhone(request.params.to),
      from: '+14152339929',
      body: request.params.first_name
              + ' wants to split a room with you!  http://bunkmates.co/t/?'
              + request.params.listing_id,
    }, function(err, responseData) {
      if (err) {
        console.log(err);
        response.error('twilio send failed: ' + err);
      } else {
        console.log(responseData.from);
        console.log(responseData.body);
        response.success('twilio send worked');
      }
    }
  );
});

Parse.Cloud.define('sendMeetupInfo', function(request, response) {
  var txn = request.params.txn;
  var listing = request.params.attributes.listing;
  sendsms(listing.host_phone, txn.guest_phone);

  function sendsms(host_number, guest_number) {
    console.log('Sending meetup text to', host_number, guest_number);
    // SMS to host
    client.sendSms({
        to: formatPhone(host_number),
        from: '+14152339929',
        body: 'Meet your bunkmate at the hotel to exchange room key and payment. Text or call to coordinate:....'
      }, function(err, responseData) {
        if (err) {
          console.log(err);
          response.error('twilio send failed: ' + err);
        } else {
          console.log(responseData.from);
          console.log(responseData.body);
          response.success('twilio send worked');
        }
      }
    );

    // SMS to guest
    client.sendSms({
        to: formatPhone(guest_number),
        from: '+14152339929',
        body: 'Meet your bunkmate at the hotel to exchange room key and payment. Text or call to coordinate:....'
      }, function(err, responseData) {
        if (err) {
          console.log(err);
          response.error('twilio send failed: ' + err);
        } else {
          console.log(responseData.from);
          console.log(responseData.body);
          response.success('twilio send worked');
        }
      }
    );
  }
});

Parse.Cloud.define('sendRejection', function(request, response) {
  console.log(request.params);
  var txn_id = request.params.txn_id;
  client.sendSms({
      to: formatPhone(request.params.to),
      from: '+14152339929',
      body: request.params.first_name
              + ' wants to split a room with you!  http://bunkmates.co/t/?'
              + request.params.listing_id,
    }, function(err, responseData) {
      if (err) {
        console.log(err);
        response.error('twilio send failed: ' + err);
      } else {
        console.log(responseData.from);
        console.log(responseData.body);
        response.success('twilio send worked');
      }
    }
  );
});

Parse.Cloud.define('sendTest', function(request, response) {
  // Send an SMS message
  client.sendSms({
      to: '+19147727429',
      from: '+14152339929',
      body: 'Hello werld!'
    }, function(err, responseData) {
      if (err) {
        console.log(err);
        response.error('twilio send failed: ' + err);
      } else {
        console.log(responseData.from);
        console.log(responseData.body);
        response.success('twilio send worked');
      }
    }
  );
});
