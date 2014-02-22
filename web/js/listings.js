var Listing = Parse.Object.extend("Listing");

function submit_listing() {
  var hotel_name = $('#hotel_name').val();
  var price = parseFloat($('#charge').val());
  var desc = $('#user_desc').val();

  var listing = new Listing();

  var proceed = function() {
    console.log('proceeding');
    FB.api('/me', function(resp) {
      // SAVE THE LISTING
      listing.save({
        hotel: hotel_name,
        price: price,
        desc: desc,
        name: resp.first_name + ' ' + resp.last_name,
        fb_id: resp.id,
        host_email: resp.email,
        host_gender: resp.gender,
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
