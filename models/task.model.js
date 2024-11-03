const mongoose = require('mongoose');

const StatusEnum = ['ticket', 'check', 'in-progress', 'complete'];

const TaskDetailsSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please enter the task title"],
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: StatusEnum,
            required: [true, "Please select a status"],
        }
    },
);

const TaskSchema = mongoose.Schema(
    {
        ...TaskDetailsSchema.obj, 
        subTask: {
            type: [TaskDetailsSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const task = mongoose.model("Task", TaskSchema);

module.exports = task;
