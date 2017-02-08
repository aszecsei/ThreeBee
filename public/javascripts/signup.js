/**
 * Created by Tanner on 2/7/2017.
 */
var invalid = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?";
function submit() {
        checkFirst()
}

function checkFirst() {
    var first = document.getElementById("firstName").value;
    if (first.test(invalid)){
            return false;
    }
    else if(!first.test(invalid)){
            return true;
    }


}
function checkLast() {

    var last = document.getElementById("lastName").value;
    if (last.test(invalid)){
        return false;
    }
    else if(!last.test(invalid)){
        return true;
    }

}
function checkEmail() {
    var first = document.getElementById("firstName").value;
    if (first.test(invalid)){
        return false;
    }
    else if(!first.test(invalid)){
        return true;
    }


}
function checkStreet() {
    
}
function checkCity() {

}
function checkState() {

}
function checkCountry() {

}
function checkZip() {

}
