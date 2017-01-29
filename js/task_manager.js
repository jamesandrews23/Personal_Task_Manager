console.log('here');
+function($){
    "use strict";
    // var create_task_button = document.getElementById('add_task_button');
    // create_task_button.addEventListener('click', submit_form);
    // document.forms['add_task_form'].addEventListener('submit', submit_form);
    document.getElementById('add_task_form').addEventListener('submit', submit_form);
    
    function submit_form(e){
        var form = document.forms['add_task_form'].elements;
        for(var i = 0; i < form.length; i++){
            
        }
    }

    var CATEGORY = {
        START       : {value: 0, name: 'Started', code: 'S'},
        PROGRESS    : {value: 1, name: 'In Progress', code: 'P'},
        COMPLETE    : {value: 2, name: 'Completed', code: 'C'}
    };
    
    var Task_Model = Backbone.Model.extend({
        defaults: function(){
            return {
                title: "The Title",
                description: "Description of project",
                category: CATEGORY.START
            }
        }
    });

    var Tasks = Backbone.Collection.extend({
        model: Task_Model,
        
        initialize: function(){
            
        }
    });

    var Task_View = Backbone.View.extend({
        el: '.tasks',
        template: _.template($('#task_template').html()),

        initialize: function(){

        },

        render: function(){
            return this;
        }
    });

    var Application_View = Backbone.View.extend({
        el: '#app',
        collection: Tasks,
        
        events: {
            
        },

        initialize: function(){
            this.listenTo(this.collection, 'add', this.add_task);
            this.listenTo(this.collection, 'remove', this.remove_task);
            this.listenTo(this.collection, 'reset', this.reset_tasks);
        },
        
        add_task: function(task){
            
        },
        
        remove_task: function(task){
            
        },
        
        reset_tasks: function(tasks){
            
        }
    });

    var app = new Application_View;

}(jQuery);