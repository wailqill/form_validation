(function() {
  
  window.wq = window.wq || {};
  wq.Form = wq.Form || {};
  
  var form_validations = $H();
  
  wq.Form.Validation = Class.create({
    initialize: function(form) {
      if (!form) throw("No element specified.");
      this.form = $(form);
      form_validations.set(this.form, this);
      
      this.fields = $A();
      this.fields.add = addElements.curry(this);
      this._submitHandler = this.validate.bindAsEventListener(this);
      this.form.observe("submit", this._submitHandler);
      this.form.fire("fv:create");
    },
    validate: function(e) {
      var result = this.fields.invoke("validate").all();
      if (!result && e instanceof Event) e.stop();
      return result;
    }
  });
  function addElements(fv, elms, options) {
    if (typeof(elms) == "string") elms = $$(elms);
    elms.each(function(elm) {
      this.push(new wq.Form.Validation.Field(elm, options));
      elm.fire("fv:field:added", { element: elm });
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
    	
    	// Trigger remove for all elements
    	fv.fields.each(function(elm) {
    	  wq.Form.Validation.Field.remove(elm);
    	});
    	
    	// Remove event handler for submit
    	fv.form.stopObserving("submit", fv._submitHandler);
      
      // Delete references to the form itself
      var form = fv.form;
    	delete fv;
      form_validations.unset(form);
      
      return true;
    }
  });
  
  wq.Form.Validation.Field = Class.create({
    initialize: function(elm, options) {
      var elm = $(elm);
      this.element = elm;
      this.options = arguments[1] || {};
      if (this.options.email === true) this.options.email = wq.Form.Validation.Validators.EmailFormats.RealisticRFC2822;
    },
    validate: function() {
      var v = wq.Form.Validation.Validators;
      var valid = $H(this.options).all(function(opt) {
        return !v[opt.key] || v[opt.key](this.element.getValue(), opt.value);
      }.bind(this));
      this.element.fire("fv:field:validated", {
        element: this.element,
        valid: valid
      });
      return valid;
    }
  });
  Object.extend(wq.Form.Validation.Field, {
    remove: function() {
      // TODO: MAke something nice here.
    }
  });
  
  wq.Form.Validation.Validators = {
    required: function(input, option) {
      return input && input != "null" && input.length > 0;
    },
    email: function(input, option) {
      return !input || option.test(input);
    },
    regexp: function(input, option) {
      return !input || option.test(input);
    },
    numeric: function(input, option) {
      if (!input) return true;
      if (option == "positive") return this.numeric_positive(input);
      if (option == "negative") return this.numeric_negative(input);
      return input == parseFloat(input).toString();
    },
    numeric_positive: function(input) {
      return input == Math.abs(parseFloat(input)).toString();
    },
    numeric_negative: function(input) {
      return input == -Math.abs(parseFloat(input)).toString();
    },
    length: function(input, range) {
      return range.include(input.length);
    },
    min_length: function(input, option) {
      return input.length >= option;
    },
    max_length: function(input, option) {
      return input.length <= option;
    },
    EmailFormats: {
      // RegExp to follow the exact RFC defenition
      RFC2822: /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
      // The above with some modifications:
      // Specific TLDs with 3 or more chars, and all 2-letter TLDs.
      // Doesn't allow for double quoted local part
      RealisticRFC2822: /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[a-z]{2}|aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah)\b$/i
    }
  };
  
})();