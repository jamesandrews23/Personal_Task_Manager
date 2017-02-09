var Storage = {
    storage_id: "my_local_storage",

    get_stored_items: function(){
        try {
            var val = localStorage.getItem(this.storage_id);
            if(val) {
                var parsed = this._parse_stored_items(val);
                return parsed || null;
            } else {
                return null;
            }
        } catch (e){
            console.warn("ERROR: unable to get items " + e);
            return null;
        }
    },

    set_stored_items: function(model) {
        try {
            //if param is null or undefined return null
            if(_.isNull(model) || _.isUndefined(model)) return null;

            var in_storage = this.get_stored_items();

            if(model instanceof Backbone.Model) {
                if(!_.isNull(in_storage)) {
                    localStorage.setItem(this.storage_id, JSON.stringify(model.collection.toJSON()));
                } else {
                    //this should run the first time through
                    var json = JSON.stringify(model.collection.toJSON());
                    localStorage.setItem(this.storage_id, json);
                }
            } else {
                //we are only interested in dealing with backbone
                return null;
            }
        } catch(e){
            console.warn("ERROR:set_stored_items");
        }
    },
    
    remove_stored_items: function(id){
        localStorage.removeItem(id);
    },

    //want to treat this as a private method
    _parse_stored_items: function(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            console.warn('Unable to parse json');
            return null;
        }
    }
};

_.bindAll(Storage, "get_stored_items", "set_stored_items", "_parse_stored_items");
