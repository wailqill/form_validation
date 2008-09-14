(function() {
  
  window.wq = window.wq || {};
  wq.Form = wq.Form || {};
  
  var form_validations = $H();
  
  wq.Form.Validation = Class.create({
    initialize: function(form) {
      if (!form) throw("No element specified.");
      this.form = $(form);
      form_validations.set(this.form, this);
      
      wq.Form.Validation.prototype.elements.add = addElements.curry(this);
      this.form.fire("fv:create");
    },
    elements: $A()
  });
  function addElements(fv) {
    var elms = arguments[1];
    if (typeof(elms) == "string") elms = $$(elms);
    elms.each(function(elm) {
      this.push(new wq.Form.Validation.Element(elm));
      fv.form.fire("fv:element:added", { element: elm });
    }.bind(this));
  };
  
  Object.extend(wq.Form.Validation, {
    forElement: function(element) {
      var form = $(element);
      /*if (!form) return null;
      if (form.tagName.toUpperCase() != "FORM") form = form.form;
      if (form.tagName.toUpperCase() != "FORM") return null;*/
      return form_validations.get(form);
    },
    remove: function(element) {
    	var fv = this.forElement(element);
    	if (!fv) return true;
    	var form = fv.form;
      fv = null;
      form_validations.unset(form);
      return true;
    }
  });
  
  wq.Form.Validation.Element = Class.create({
    initialize: function(elm, options) {
      var elm = $(elm);
      this.element = elm;
      this.options = arguments[1] || {};
    },
    validate: function() {
      return !(this.options.required && !$F(this.element));
    }
  });
  
  wq.Form.Validation.Validators = {
    
  };
  
})();