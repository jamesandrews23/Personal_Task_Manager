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
                category: 0,
                time: Date.now()
            }
        },

        initialize: function(){
            
        }
    });

    var Tasks_List = Backbone.Collection.extend({
        model: Task_Model,
        comparator: 'time',

        initialize: function(){
            // var tasks = Storage.get_stored_items();
            // if(tasks){
            //     this.set(tasks);
            // }
            this.fetch();
        }
    });

    var tasks = new Tasks_List;

    var Task_View = Backbone.View.extend({
        model: Task_Model,
        template: _.template($('#task_template').html()),

        events: {
            "click .task-delete"    :   "removeTask",
            "click"                 :   "editTask"
        },

        initialize: function(){
            _.bindAll(this, "editTask", "removeTask");
            this.listenTo(this.model, 'add remove change', console.log('updated'));
        },

        render: function(){
            this.$el.html(
                this.template({title: this.model.get('title')})
            );
            this.$el.popover({
                trigger: 'hover',
                title: 'Description',
                placement: 'right',
                content: this.model.get('description'),
                html: true,
                container: 'body'
            });
            return this;
        },
        
        editTask: function(){
            console.log("edit");
        },
        
        removeTask: function(){
            this.model.destroy();
            this.$el.popover('destroy');
            this.remove();
        }
    });

    var Application_View = Backbone.View.extend({
        el: '#app',
        collection: tasks,
        
        events: {
            
        },

        initialize: function(){
            _.bindAll(this, "addTask", "removeTask", "resetTask", "changeTask");
            this.listenTo(this.collection, 'add', this.addTask);
            this.listenTo(this.collection, 'remove', this.removeTask);
            this.listenTo(this.collection, 'reset', this.resetTask);
            this.listenTo(this.collection, 'change', this.changeTask);
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
                    this.$el.find('#col_start').append(a_task.render().el);
                    break;
                case "progress":
                    this.$el.find('#col_progress').append(a_task.render().el);
                    break;
                case "complete":
                    this.$el.find('#col_complete').append(a_task.render().el);
                    break;
                default:
                    this.$el.find('#col_start').append(a_task.render().el);
                    break;
            }
        },

        changeTask: function(tasks){
            console.log('change');
        },
        
        removeTask: function(task){
            //
        },
        
        resetTask: function(tasks){
            console.log("tasks to be reset" + tasks);
        }
    });

    var app = new Application_View;
}(jQuery);