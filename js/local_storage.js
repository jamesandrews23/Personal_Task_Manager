var StorageManager = function(name){
    this.id = name;
    this.idPattern = new RegExp(name + "_" + '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}', 'gi');
};

StorageManager.prototype = {

    setStorageItem: function(val){
        var id = this._generateUUID();
        if(val instanceof Backbone.Model){
            if(val.isNew()){
                val.set("idAttribute", id);
                localStorage.setItem(id, this._serializeItem(val));
            } else {
                //if it's not new maybe update?
                this.updateStorageItem(val.get("idAttribute"), val);
            }
        } else if(val instanceof Backbone.Collection){
            //if it's coming from a collection need to get the items and
            localStorage.setItem(id, this._serializeItem(val));
        } else {
            
        }
    },
    
    //should the item be removed from storage?
    getStorageItem: function(key){
        var storedItem = localStorage.getItem(this.id + "_" + key);
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
        //maybe write something that clears only the cached items
        localStorage.clear();
    },
    
    removeStorageItem: function(key){
        localStorage.removeItem(key);    
    },

    updateStorageItem: function(key, obj){
        var storedItem = this.getStorageItem(key);
        if(!_.isNull(storedItem)){
            
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
        return this.id + "_" + uuid();
    }
};

function uuid(){
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4(){
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}