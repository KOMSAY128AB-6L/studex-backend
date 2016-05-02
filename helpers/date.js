'use strict';



function get_today () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var ss = today.getSeconds();
    var hh = today.getHours();
    var mi = today.getMinutes();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'-'+dd+'-'+yyyy+'-'+hh+''+mi+''+ss;
    return today;
}

module.exports = {
    get_today
};
