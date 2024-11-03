const mongoose = require('mongoose');
const Task = require("../models/task.model");
const { isValidObjectId } = mongoose;

/**
 * Utility functions for validation
 */
const validations = {
    validateId(id) {
        if (!isValidObjectId(id)) {
            throw {
                status: 400,
                message: "Invalid ID format"
            };
        }
    },

    validateTaskFields(taskData) {
        const { title, status } = taskData;

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            throw {
                status: 400,
                message: "Title is required and must be a non-empty string"
            };
        }

        if (!status) {
            throw {
                status: 400,
                message: "Status is required"
            };
        }

        if (!['ticket', 'check', 'in-progress', 'complete'].includes(status)) {
            throw {
                status: 400,
                message: "Invalid status value. Must be one of: ticket, check, in-progress, complete"
            };
        }

        return {
            ...taskData,
            title: title.trim(),
            description: taskData.description?.trim()
        };
    },

    validateSubTaskFields(subTaskData) {
        if (!subTaskData) {
            throw {
                status: 400,
                message: "SubTask data is required"
            };
        }
        return this.validateTaskFields(subTaskData);
    },

    validateUpdateFields(updateData) {
        const cleanData = {};
        
        if (updateData.title !== undefined) {
            if (typeof updateData.title !== 'string' || updateData.title.trim().length === 0) {
                throw {
                    status: 400,
                    message: "Title must be a non-empty string"
                };
            }
            cleanData.title = updateData.title.trim();
        }

        if (updateData.description !== undefined) {
            if (typeof updateData.description !== 'string') {
                throw {
                    status: 400,
                    message: "Description must be a string"
                };
            }
            cleanData.description = updateData.description.trim();
        }

        if (updateData.status !== undefined) {
            if (!['ticket', 'check', 'in-progress', 'complete'].includes(updateData.status)) {
                throw {
                    status: 400,
                    message: "Invalid status value"
                };
            }
            cleanData.status = updateData.status;
        }

        if (Object.keys(cleanData).length === 0) {
            throw {
                status: 400,
                message: "No valid fields provided to update"
            };
        }

        return cleanData;
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        validations.validateId(id);

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        handleError(error, res);
    }
};


const createTask = async (req, res) => {
    try {
        const cleanData = validations.validateTaskFields(req.body);
        const task = await Task.create(cleanData);
        
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        handleError(error, res);
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        validations.validateId(id);
        
        const cleanData = validations.validateUpdateFields(req.body);
        const task = await Task.findByIdAndUpdate(
            id, 
            cleanData,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    } catch (error) {
        handleError(error, res);
    }
};

/**
 * Add a new subtask to an existing task
 */
const addSubTask = async (req, res) => {
    try {
        const { id } = req.params;
        validations.validateId(id);
        
        const cleanSubTaskData = validations.validateSubTaskFields(req.body);
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $push: { subTask: cleanSubTaskData } },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subtask added successfully",
            data: updatedTask
        });
    } catch (error) {
        handleError(error, res);
    }
};

/**
 * Update a specific subtask
 */
const updateSubTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...updateData } = req.body.subTask;

        validations.validateId(id);
        validations.validateId(_id);

        const cleanData = validations.validateUpdateFields(updateData);
        
        // Convert clean data to dot notation for subtask update
        const updateFields = Object.entries(cleanData).reduce((acc, [key, value]) => {
            acc[`subTask.$.${key}`] = value;
            return acc;
        }, {});

        const updatedTask = await Task.findOneAndUpdate(
            { 
                _id: id, 
                'subTask._id': _id 
            },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task or subtask not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subtask updated successfully",
            data: updatedTask
        });
    } catch (error) {
        handleError(error, res);
    }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        validations.validateId(id);

        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        handleError(error, res);
    }
};

/**
 * Common error handler
 */
const handleError = (error, res) => {
    console.error('Operation error:', error);
    
    if (error.status) {
        return res.status(error.status).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateSubTask,
    addSubTask,
    deleteTask,
    validations // export validations เผื่อนำไปใช้ที่อื่น
};