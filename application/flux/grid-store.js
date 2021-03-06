'use strict';

var Fluxxor = require('fluxxor');
var store   = require('store');
var _       = require('underscore');

var saveToLocalStorage = (grids) => {
    store.set('grids', grids);
};

export default Fluxxor.createStore({
    initialize : function()
    {
        this.grids = store.get('grids');

        if (! this.grids) {
            this.grids = [this.getInitialGrid()];
        }

        this.selectedGrid = 0;

        this.bindActions(
            'ADD_GRID', 'onAddGrid',
            'ADD_TASK', 'onAddTask',
            'TOGGLE_COMPLETED', 'onToggleCompleted',
            'REMOVE_TASK', 'onRemoveTask',
            'SELECT_GRID', 'onSelectGrid'
        );
    },

    getInitialGrid : function()
    {
        return {
            name  : 'Things to Do',
            tasks : {
                do       : [],
                plan     : [],
                delegate : [],
                delay    : []
            }
        };
    },

    onAddGrid : function(name)
    {
        this.grids.push({
            name  : name,
            tasks : {
                do       : [],
                plan     : [],
                delegate : [],
                delay    : []
            }
        });

        this.saveToLocalStorage();

        this.emit('change');
    },

    onAddTask : function(task)
    {
        var grid = this.grids[task.grid];

        grid.tasks[task.quadrant].push({
            task      : task.task,
            completed : false
        });

        this.saveToLocalStorage();

        this.emit('change');
    },

    onToggleCompleted : function(task)
    {
        var taskToToggle = this.grids[task.grid].tasks[task.quadrant][task.id];

        taskToToggle.completed = ! taskToToggle.completed;

        this.saveToLocalStorage();

        this.emit('change');
    },

    onRemoveTask : function(task)
    {
        this.grids[task.grid].tasks[task.quadrant].splice(task.id, 1);

        this.saveToLocalStorage();

        this.emit('change');
    },

    onSelectGrid : function(index)
    {
        this.selectedGrid = index;

        this.emit('change');
    },

    saveToLocalStorage : function()
    {
        store.set('grids', this.grids);
    },

    getAll : function()
    {
        return this.grids;
    },

    getTasksForSelectedGrid : function()
    {
        return this.grids[this.selectedGrid].tasks;
    },

    getSelectedGrid : function()
    {
        return this.selectedGrid;
    }
});
