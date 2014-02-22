'use strict';

var Listing = Parse.Object.extend("Listing");

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
      // SAVE THE LISTING
      listing.save({
        hid: selected_hotel_info._id,
        eid: selected_hotel_info._source.id,
        address: selected_hotel_info._source.Address1 + selected_hotel_info._source.Address2,
        img: selected_hotel_info._source.img,
        rating: selected_hotel_info._source.StarRating,
        hotel: hotel_name,
        price: price,
        desc: desc,
        name: resp.first_name + ' ' + resp.last_name,
        first_name: resp.first_name,
        fb_id: resp.id,
        host_email: resp.email,
        host_gender: resp.gender,
        host_number: phone
      }, {
        success: function(listing) {
          // The object was saved successfully.
          // TODO some indicator of success
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
function fill_listings(cb) {
  var q = new Parse.Query(Listing);
  q.descending('createdAt');

  q.find({
    success: function(listings) {
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

}

function hotel_selected() {
  var $li = $(this);
  $('#hotel_name').val($li.html());
}

function load_listing(id) {
  var listing = listings_map[id];
  if (!listing) {
    alert('Sorry, something went wrong and we couldn\'t find this listing.');
    window.location.hash = '#';
    return;
  }

  $('#listing_desc').html(tmpl('listing_desc_tmpl', {
    listing: listing
  }));
}
