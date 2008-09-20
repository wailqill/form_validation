$(document).observe("dom:loaded", function() {
  var fv = new wq.Form.Validation("demo-form", {
    "#name": { min_length: 5 },
    "#email": { required: true, email: true },
    "#age": { required: true, integer: "positive" }
  });
});