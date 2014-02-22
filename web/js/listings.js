

function submit_listing() {
  console.log('here');
  var hotel_name = $('#hotel_name').val();
  var cost = parseFloat($('#charge').val());
  var desc = $('#user_desc').val();

  var Listing = Parse.Object.extend("Listing");
  var listing = new Listing();

  listing.save({
    hotel: hotel_name,
    cost: cost,
    desc: desc
  }, {
    success: function(gameScore) {
      // The object was saved successfully.
      alert('Success!');
      window.location.hash = '#';
    },
    error: function(gameScore, error) {
      // The save failed.
      // error is a Parse.Error with an error code and description.
      alert('Fail');
    }
  });
  return false;
}
