+function($){
    "use strict";

    document.getElementById('add_task_button').addEventListener('click', submit_form);

    function submit_form(e){
        e.preventDefault();
        var form_elements = document.forms['add_task_form'].elements;
        tasks.create({
            title: form_elements[0].value,
            description: form_elements[1].value,
            category: form_elements[2].value
        });
    }

    var cache = new StorageManager("task-cache");

    Backbone.sync = function(method, model, options){
        switch(method){
            case "create":
                cache.setStorageItem(model);
                break;
            case "update":
                cache.updateStorageItem(model);
                break;
            case "read":
                if(model instanceof Backbone.Model){
                    cache.getStorageItem(model.get("idAttribute"));
                } else if(model instanceof Backbone.Collection){
                    var items = cache.getAllItems();
                    if(!_.isEmpty(items))
                        this.set(items);
                }
                break;
            case "delete":
                cache.removeStorageItem(model.id);
                break;
            default:
                break;
        }
    };

    var Task_Model = Backbone.Model.extend({
        defaults: function(){
            return {
                title: "Project",
                description: "A brief description of project.",
                category: "start",
                time: Date.now(),
                mode: 'view'
            }
        },

        initialize: function(){
            
        }
    });

    var Tasks_List = Backbone.Collection.extend({
        model: Task_Model,
        comparator: 'time',

        initialize: function(){
            this.listenTo(this, 'remove', this.removeFromCollection);
            this.fetch();
        },

        removeFromCollection: function(model){
            this.remove(model);
        }
    });

    var tasks = new Tasks_List;

    var Task_View = Backbone.View.extend({
        model: Task_Model,
        template: _.template($('#task_template').html()),

        events: {
            "click .task-delete"        :   "removeTask",
            "click .task-edit"          :   "editTask",
            "click .task-confirm-edit"  :   "confirmEdit",
            "click .task-cancel-edit"   :   "cancelEdit",
            "dragstart"                 :   "dragStart"
        },

        initialize: function(){
            _.bindAll(this, "editTask", "removeTask", "confirmEdit", "cancelEdit", "doneEditing", "removeView");
            this.listenTo(this.model, 'invalid', this.updateFormWithErrors);
            this.listenTo(this.model, 'change:mode', this.render);
            this.listenTo(this.model, 'change:category', this.removeView);
        },

        render: function(){
            this.$el.html(this.template({data: this.model.attributes}));
            return this;
        },
        
        editTask: function(){
            this.model.set("mode", "edit");
        },

        confirmEdit: function(e){
            e.preventDefault();
            this.model.save({
                title: this.$('.editForm-title').val(),
                description: this.$('.editForm-desc').val(),
                mode: 'view'
            });
            this.doneEditing();
        },

        cancelEdit: function(e){
            e.preventDefault();
            this.doneEditing();
        },

        doneEditing: function(){
            this.model.set("mode", "view");
        },
        
        removeTask: function(){
            this.model.destroy();
            this.$('.task-edit').hide();
            this.$('.task-delete').hide();
            this.$el.animate({
                opacity: 0,
                marginRight: '+=70%'
            }, 400, '', function(){ this.remove(); });
        },

        //called by backbone when saving or setting a model
        validate: function(attributes, options){
            console.log('validate');
            //need some validation awesomeness here.
            //returning nothing means it's valid, return anything else means it's invalid
            //and will be saved in the models validationError property
        },

        updateFormWithErrors: function(model, error){
            //this function will be called when the validate method fails and returns an error.
            
        },

        dragStart: function(ev){
            ev.originalEvent.dataTransfer.setData("text/plain", this.model.id);
            ev.originalEvent.dataTransfer.dropEffect = "move";
        },

        removeView: function(){
            this.remove();
        }
    });

    var Application_View = Backbone.View.extend({
        el: '#app',
        collection: tasks,
        
        events: {
            "click #clearAll"           :   "clearAllTasks",
            "click #add_task_button"    :   "testingTask",
            "drop"                      :   "dropTask",
            "dragover"                  :   "dragOver"
        },

        initialize: function(){
            _.bindAll(this, "addTask", "removeTask", "resetTask", "changeTask", "dropTask");
            this.listenTo(this.collection, 'add', this.addTask);
            this.listenTo(this.collection, 'remove', this.removeTask);
            this.listenTo(this.collection, 'reset', this.resetTask);
            this.listenTo(this.collection, 'change:category', this.changeTask);
            this.render();
        },
        
        render: function(){
            var self = this;
            _.each(this.collection.models, function(model){
                self.addTask(model);
            });
            return this;
        },
        
        addTask: function(task){
            var a_task = new Task_View({model: task});
            switch(task.get('category')){
                case "start":
                    this.$('#start').append(a_task.render().el);
                    break;
                case "progress":
                    this.$('#progress').append(a_task.render().el);
                    break;
                case "complete":
                    this.$('#complete').append(a_task.render().el);
                    break;
                default:
                    this.$('#start').append(a_task.render().el);
                    break;
            }
        },

        changeTask: function(task){
            this.addTask(task);
        },
        
        removeTask: function(task){
            //
        },
        
        resetTask: function(tasks){
            cache.clearAllItems();
            this.$el.find('.tasks').remove();
        },
        
        clearAllTasks: function(){
            this.collection.reset();
        },

        testingTask: function(e){
            console.log('testing');
        },

        dropTask: function(ev){
            ev.preventDefault();
            if(ev.target.className.includes('dropZone')){
                var taskId = ev.originalEvent.dataTransfer.getData('text/plain');
                var model = this.collection.findWhere({id:taskId});
                if(model){
                    model.set("category", ev.target.id);
                }
            }
        },

        dragOver: function (ev) {
            ev.preventDefault();
        }
    });

    var app = new Application_View;
}(jQuery);