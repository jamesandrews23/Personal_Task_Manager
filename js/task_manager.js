+function($){
    "use strict";

    document.getElementById('add_task_button').addEventListener('click', submit_form);

    function submit_form(e){
        e.preventDefault();
        var form_elements = document.forms['add_task_form'].elements;
        tasks.add({
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
        }
    });

    var Tasks_List = Backbone.Collection.extend({
        model: Task_Model,
        
        initialize: function(){
            
        },

        comparator: 'time'
    });

    var tasks = new Tasks_List;

    var Task_View = Backbone.View.extend({
        template: _.template($('#task_template').html()),

        events: {
            "click .task-edit"      :   "edit",
            "click .task-delete"    :   "remove"
        },

        initialize: function(){
            _.bindAll(this, "edit", "remove");
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
        
        edit: function(){
            console.log("edit");
        },
        
        remove: function(){
            console.log("removed");
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
        
        remove_task: function(task){
            console.log("task to be removed" + task);
        },
        
        reset_tasks: function(tasks){
            console.log("tasks to be reset" + tasks);
        }
    });

    var app = new Application_View;

}(jQuery);