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
      if (this.options.email === true) this.options.email = wq.Form.Validation.Validators.EmailFormats.RealisticRFC2822;
    },
    validate: function() {
      var v = wq.Form.Validation.Validators;
      return $H(this.options).all(function(opt) {
        return !v[opt.key] || v[opt.key](this.element.getValue(), opt.value);
      }.bind(this));
    }
  });
  
  wq.Form.Validation.Validators = {
    required: function(input, option) {
      return input && input != "null" && input.length > 0;
    },
    email: function(input, option) {
      return option.test(input);
    },
    regexp: function(input, option) {
      return option.test(input);
    },
    EmailFormats: {
      // RegExp to follow the exact RFC defenition
      RFC2822: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
      // The above with some modifications:
      // Specific TLDs with 3 or more chars, and all 2-letter TLDs.
      // Doesn't allow for double quoted local part
      RealisticRFC2822: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[a-z]{2}|aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah)\b$/i
    }
  };
  
})();