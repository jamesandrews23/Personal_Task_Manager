var StorageManager = function(name){
    this.id = name;
    this.idPattern = new RegExp(name + "_" + '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}', 'gi');
};

StorageManager.prototype = {

    setStorageItem: function(val){
        var id = this._generateUUID();
        if(val instanceof Backbone.Model){
            if(val.isNew()){
                val.id = id;
                val.set(val.idAttribute, val.id);
                localStorage.setItem(this.id+"_"+id, this._serializeItem(val));
            } else {
                //if it's not new maybe update?
                this.updateStorageItem(val);
            }
        } else if(val instanceof Backbone.Collection){
            //if it's coming from a collection need to get the items and
            localStorage.setItem(id, this._serializeItem(val));
        } else {
            
        }
    },
    
    //should the item be removed from storage?
    getStorageItem: function(key){
        var storedItem = localStorage.getItem(this.id+"_"+key);
        if(!_.isNull(storedItem)){
            return this._deserializeItem(storedItem);
        } else {
            return null;
        }
    },

    getAllItems: function(){
        var
            list = [],
            length = localStorage.length,
            i = 0;
        for(i; i < length; i++){
            var storedKey = localStorage.key(i);
            if(storedKey.match(this.idPattern)){
                var item = localStorage[storedKey];
                var parsedItem = this._deserializeItem(item);
                if(!_.isNull(parsedItem))
                    list.push(parsedItem);
            }
        }
        return list;
    },

    clearAllItems: function(){
        for(var i = 0; i < localStorage.length; i++){
            if(localStorage.key(i).match(this.idPattern)){
                localStorage.removeItem(localStorage.key(i));
            }
        }
    },
    
    removeStorageItem: function(key){
        localStorage.removeItem(this.id+"_"+key);    
    },

    //before calling update through backbone.sync, backbone has already made the check whether or not the model is new
    updateStorageItem: function(obj) {
        if (obj instanceof Backbone.Model){
            var saved = this.getStorageItem(obj.id);
            if (!_.isNull(saved)){
                var toSave = obj.toJSON();
                //merging toSaved into saved and setting saved in localStorage
                $.extend(true, saved, toSave);
                localStorage.setItem(this.id+"_"+saved.id, this._serializeItem(saved));
            }
        }
    },

    _serializeItem: function(obj){
        if(obj instanceof Backbone.Model || obj instanceof Backbone.Collection){
            return JSON.stringify(obj.toJSON());
        } else if(_.isObject(obj) && !_.isFunction(obj)){
            return JSON.stringify(obj);
        } else {
            return "";
        }
    },

    _deserializeItem: function(val){
        if(typeof val === 'string'){
            try {
                return JSON.parse(val);
            } catch(e){
                console.warn('ERROR: Unable to parse string - ' + e);
                return null;
            }
        }
    },

    _generateUUID: function(){
        return uuid();
    }
};

function uuid(){
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4(){
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}