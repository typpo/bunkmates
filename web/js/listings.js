var Listing = Parse.Object.extend("Listing");

function submit_listing() {
  console.log('here');
  var hotel_name = $('#hotel_name').val();
  var price = parseFloat($('#charge').val());
  var desc = $('#user_desc').val();

  var listing = new Listing();

  listing.save({
    hotel: hotel_name,
    price: price,
    desc: desc
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
  return false;
}

var listings_map = {};
function fill_listings() {
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
}
