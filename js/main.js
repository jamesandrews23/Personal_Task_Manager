var CATEGORY = Object.freeze({
    START       : 0,
    PROGRESS    : 1,
    COMPLETE    : 2
});

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

function allowDrop(ev) {
    ev.preventDefault();
    console.log("allow drop");
}

+function(){
    if(storageAvailable('localStorage')){
        //available
    } else {
        window.alert('Storage is not available');
    }
}();
