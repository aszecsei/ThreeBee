/**
 * Created by Tanner on 2/7/2017.
 */
var invalid = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?";

// Currently not using this for validation
function testInvalid(input) {
    for (var i = 0; i < input.length; i++) {
        if (invalid.includes(input.charAt(i))) {
            return true;
        }
    }
    return false;
}

// When the document is ready
$(function() {

});