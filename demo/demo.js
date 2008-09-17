$(document).observe("dom:loaded", function() {
  var fv = new wq.Form.Validation("demo-form");
  fv.elements.add("#name", { min_length: 5 });
  fv.elements.add("#email", { required: true, email: true });
  fv.elements.add("#age", { required: true });
});