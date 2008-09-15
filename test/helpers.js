function inputTextAssertTrue(o, elm, value) { return inputTextAssertion(o, elm, value, true); }
function inputTextAssertFalse(o, elm, value) { return inputTextAssertion(o, elm, value, false); }
function inputTextAssertion(o, elm, value, expected) {
  elm.element.value = value;
  o.assertIdentical(expected, elm.validate());
}
