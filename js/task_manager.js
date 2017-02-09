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
            _.bindAll(this, "generateID", "serialize");
        },

        generateID: function(){
            return guid();
        },

        sync: function(method, model, options){
            switch(method){
                case "create":
                    if(model.isNew()){
                        model.set("idAttribute", this.generateID());
                        localStorage.setItem(model.get("idAttribute"), this.serialize(model));
                    }
                    break;
                case "update":
                    localStorage.setItem(model.get("idAttribute"), this.serialize(model));
                    break;
                case "read":
                    return localStorage.getItem(model.get("idAttribute"));
                    break;
                case "delete":
                    localStorage.removeItem(model.get("idAttribute"));
                    break;
            }
        },

        serialize: function(model){
            return JSON.stringify(model.toJSON());
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
        },

        sync: function(method, model, options){
            switch(method){
                case "create":
                    Storage.set_stored_items(model);
                    break;
                case "read":
                    Storage.get_stored_items(model.id);
                    break;
                case "update":
                    Storage.set_stored_items(model);
                    break;
                case "delete":
                    Storage.remove_stored_items(model.id);
                    break;
                default:
                    break;
            }
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
            this.listenTo(this.collection, 'add', this.add_task);
            this.listenTo(this.collection, 'remove', this.remove_task);
            this.listenTo(this.collection, 'reset', this.reset_tasks);
            this.listenTo(this.collection, 'change', this.change_tasks);
        },
        
        add_task: function(task){
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

        change_tasks: function(tasks){
            console.log('change');
        },
        
        remove_task: function(task){
            console.log("remove");
        },
        
        reset_tasks: function(tasks){
            console.log("tasks to be reset" + tasks);
        }
    });

    var app = new Application_View;

}(jQuery);