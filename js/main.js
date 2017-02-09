var CATEGORY = Object.freeze({
    START       : 0,
    PROGRESS    : 1,
    COMPLETE    : 2
});

function guid(){
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4(){
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch(e) {
        return false;
    }
}

+function(){
    if(storageAvailable('localStorage')){
        //available
    } else {
        window.alert('Storage is not available');
    }
}();
