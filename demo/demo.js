$(document).observe("dom:loaded", function() {
  var fv = new wq.Form.Validation("demo-form");
  fv.fields.add("#name", { min_length: 5 });
  fv.fields.add("#email", { required: true, email: true });
  fv.fields.add("#age", { required: true });
});