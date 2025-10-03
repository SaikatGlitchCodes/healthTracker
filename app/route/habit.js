const express = require('express');
const Router = express.Router();
const prisma = require('../../util/primaInit');

// Create a new habit
Router.post('/', async (req, res) => {
    const { title, startTime, endTime, priority, category } = req.body;
    try {
        const response = await prisma.habit.create({
            data: {
                title,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                priority: priority || 'MEDIUM',
                category: category || 'OTHER',
                userId: req.user.id  // Assuming req.user contains the authenticated user's info
            }
        });
        res.status(201).json({ message: 'Habit created', data: response });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create habit', error: err.message });
    }
});

// Get all habits for the logged-in user
Router.get('/', async (req, res) => {
    try {
        const habits = await prisma.habit.findMany({
            where: { userId: req.user.id },
            orderBy: { startTime: 'desc' }
        });
        res.status(200).json({ message: 'Habits retrieved', data: habits });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve habits', error: err.message });
    }
});

// Get a specific habit
Router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const habit = await prisma.habit.findFirst({
            where: {
                id: Number(id),
                userId: req.user.id
            }
        });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.status(200).json({ message: 'Habit retrieved', data: habit });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve habit', error: err.message });
    }
});

// Update a habit
Router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    
    try {
        const habit = await prisma.habit.findFirst({
            where: {
                id: Number(id),
                userId: req.user.id
            }
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Convert date strings to Date objects if they exist in the update data
        if (data.startTime) data.startTime = new Date(data.startTime);
        if (data.endTime) data.endTime = new Date(data.endTime);

        const response = await prisma.habit.update({
            where: { id: Number(id) },
            data
        });
        res.status(200).json({ message: 'Habit updated', data: response });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update habit', error: err.message });
    }
});

// Delete a habit
Router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const habit = await prisma.habit.findFirst({
            where: {
                id: Number(id),
                userId: req.user.id
            }
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const response = await prisma.habit.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ message: 'Habit deleted', data: response });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete habit', error: err.message });
    }
});

// Update habit status
Router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
        const habit = await prisma.habit.findFirst({
            where: {
                id: Number(id),
                userId: req.user.id
            }
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const response = await prisma.habit.update({
            where: { id: Number(id) },
            data: { status }
        });
        res.status(200).json({ message: 'Habit status updated', data: response });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update habit status', error: err.message });
    }
});

module.exports = Router;