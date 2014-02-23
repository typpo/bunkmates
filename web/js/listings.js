'use strict';

var Listing = Parse.Object.extend("Listing");
var Transaction = Parse.Object.extend("Transaction");

var selected_hotel_info = {};

function submit_listing() {
  var hotel_name = $('#hotel_name').val();
  var price = parseFloat($('#charge').val());
  var desc = $('#user_desc').val();
  var phone = $('#phone_number').val();

  var listing = new Listing();
  if (!selected_hotel_info._source) {
    alert('We didn\'t match a hotel. Please use the autocomplete');
    return;
  }

  var proceed = function() {
    console.log('proceeding');
    FB.api('/me', function(resp) {
      var geo_point = new Parse.GeoPoint({
        latitude: parseFloat(selected_hotel_info._source.Latitude),
        longitude: parseFloat(selected_hotel_info._source.Longitude)
      });
      var user = Parse.User.current();
      // SAVE THE LISTING
      listing.save({
        state: 'PENDING_APPROVAL',
        // only set guest when the full transaction is complete
        guest: null,
        reviewed: false,
        hid: selected_hotel_info._id,
        location: geo_point,
        eid: selected_hotel_info._source.id,
        address: selected_hotel_info._source.Address1 + selected_hotel_info._source.Address2,
        img: selected_hotel_info._source.img,
        rating: selected_hotel_info._source.StarRating,
        hotel: hotel_name,
        price: price,
        desc: desc,
        // TODO prepend with host
        host_name: resp.first_name + ' ' + resp.last_name,
        host_first_name: resp.first_name,
        host_last_name: resp.last_name,
        host_fb_id: resp.id,
        host_email: resp.email,
        host_gender: resp.gender,
        host_phone: phone,
        user: user
      }, {
        success: function(listing) {
          // The object was saved successfully.
          // TODO some indicator of success
          alert('Your bed was listed!');
          window.location.hash = '#';
        },
        error: function(listing, error) {
          // The save failed.
          // error is a Parse.Error with an error code and description.
          alert('Sorry, something went wrong.');
        }
      });
    });
  }

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      proceed();
    } else if (response.status === 'not_authorized') {
      fblogin(proceed);
    } else {
      fblogin(proceed);
    }
   });
  return false;
}

var listings_map = {};
function fill_listings(listings, cb) {
  listings_map = {};
  var html = '';
  $.map(listings, function(listing) {
    html += tmpl('listing_tmpl', {
      listing: listing
    });
    listings_map[listing.id] = listing;
  });
  $('#list_of_listings').html(html);
  if(cb) cb();
}
function get_all_listings(cb) {
  var q = new Parse.Query(Listing);
  q.descending('createdAt');

  q.find({
    success: function(listings) {
      fill_listings(listings, cb);
    }
  });
}

function hotel_input() {
  var input_text = $('#hotel_name').val();
  var $dropdown = $('#hotel_dropdown');
  if (input_text.length < 3) {
    $dropdown.fadeOut(100);
    return;
  }
  var url = 'http://bunkmates.co:9200/hotels/_search?q=Name:' + input_text;
  $.ajax({
    url: url,
    success: function(data) {
      if (!data || !data.hits || !data.hits.hits || !data.hits.hits.length) {
        $dropdown.fadeOut(100);
      }
      var html = [];
      for (var i in data.hits.hits) {
        html.push('<li hit="' + i + '">' + data.hits.hits[i]._source.Name + ', '
                  + data.hits.hits[i]._source.City + '</li>');
      }
      $dropdown.html(html.join(''));
      $('#hotel_dropdown li').on('click', function() {
        var $li = $(this);
        $('#hotel_name').val($li.html());
        selected_hotel_info = data.hits.hits[$li.attr('hit')];
        var $charge = $('#charge');
        if (!$charge.val()) {
          var cost = Math.floor( (parseFloat(selected_hotel_info._source.HighRate) +
                                  parseFloat(selected_hotel_info._source.LowRate)) / 4);
          $charge.val(cost);
        }
        $dropdown.html('');
        $dropdown.fadeOut(100);
      });
      $dropdown.fadeIn(100);
    }
  });
}

function submit_request() {
  var txn = new Transaction();
  var guest_desc = $('#guest_desc').val();
  var phone = prompt('Please enter your phone number.');
  if (!phone) {
    alert('Invalid phone number');
    return;
  }

  var proceed = function() {
    console.log('proceeding');
    FB.api('/me', function(resp) {
      var user = Parse.User.current();
      // Save the TXN
      txn.save({
        state: 'PENDING_APPROVAL',
        reviewed: false,
        listing: currently_viewing_listing,
        guest_name: resp.first_name + ' ' + resp.last_name,
        guest_first_name: resp.first_name,
        guest_last_name: resp.last_name,
        guest_fb_id: resp.id,
        guest_email: resp.email,
        guest_gender: resp.gender,
        guest_phone: phone,
        guest_desc: guest_desc,
        user: user
      }, {
        success: function(txn) {
          // The object was saved successfully.
          // TODO some indicator of success
          var params = {
            to: currently_viewing_listing.attributes.host_phone,
            listing_id: currently_viewing_listing.id,
            first_name: txn.attributes.guest_first_name
          };
          Parse.Cloud.run('sendRequest', params, {
            success: function(result) {
              alert('Your request was sent!');
            },
            error: function(error) {
            }
          });
          window.location.hash = '#';
        },
        error: function(listing, error) {
          // The save failed.
          // error is a Parse.Error with an error code and description.
          alert('Sorry, something went wrong.');
        }
      });
    });
  }

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      proceed();
    } else if (response.status === 'not_authorized') {
      fblogin(proceed);
    } else {
      fblogin(proceed);
    }
   });
}

function hotel_selected() {
  var $li = $(this);
  $('#hotel_name').val($li.html());
}

var currently_viewing_listing;
function load_listing(id) {
  var listing = listings_map[id];
  if (!listing) {
    alert('Sorry, something went wrong and we couldn\'t find this listing.');
    window.location.hash = '#';
    return;
  }
  currently_viewing_listing = listing;

  $('#listing_desc').html(tmpl('listing_desc_tmpl', {
    listing: listing
  }));

  $(function() {
    console.log('mutualfriends');
    if (Parse.User.current()) {
      var call_fb_api = function() {
        FB.api('/me/mutualfriends/' + listing._serverData.fb_id, function(resp) {
          if (!resp || !resp.data || !resp.data.length) {
            $('#mutual_friends').addClass('hidden');
          } else {
            $('#mutual_friends').removeClass('hidden');
            $('#mutual_friend_count').html(resp.data.length);
          }
        });
      }
      if (typeof FB === 'undefined') {
        fb_init_fns.push(call_fb_api);
      } else {
        call_fb_api();
      }
    }
  });
} // end load_listing

function filter_results(loc, cb) {
  console.log(loc);
  console.log(loc.lat());
  console.log(loc.lng());
  var point = new Parse.GeoPoint({
    latitude: loc.lat(),
    longitude: loc.lng()
  });
  var query = new Parse.Query(Listing);
  query.near('location', point);
  query.find({
    success: function(places) {
      fill_listings(places, cb);
    }
  });
}
