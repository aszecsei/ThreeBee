//This is me trying to get the calendar to work
var date_picker = require('react-dates');
var single_date = require('react-dates/SingleDatePicker');
var single_date = new date_picker(options);


var options = {
    numberOfMonths: PropTypes.number,
    required: true
}



// Matching search to available search terms

function showResult(str) {
    if(str.length == 0){
        document.getElementById("livesearch").innerHTML="";

    }
}
