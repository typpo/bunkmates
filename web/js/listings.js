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
      html = [];
      for (i in data.hits.hits) {
        html.push('<li>' + data.hits.hits[i]._source.Name + '</li>');
      }
      $dropdown.html(html.join(''));
      $('#hotel_dropdown li').on('click', function() {
        var $li = $(this);
        $('#hotel_name').val($li.html());
        $dropdown.html('');
        $dropdown.fadeOut(100);
      });
      $dropdown.fadeIn(100);
    }
  });
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
}
