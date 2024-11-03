const express = require('express');
const { 
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateSubTask,
    addSubTask,
    deleteTask,
} = require('../controllers/task.controller.js');
const router = express.Router();


router.get('/task', getTasks);
router.get('/task/:id', getTask);
router.post('/create', createTask);
router.post('/update/:id', updateTask);
router.post('/create/subtask/:id', addSubTask);
router.post('/update/subtask/:id/', updateSubTask);
router.post('/delete/:id', deleteTask);

module.exports = router