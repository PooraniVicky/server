import express from 'express';
import Assignment from '../models/assignmentSchema.js';
import { authenticate, authorize } from '../middleware/auth.js';

const assignmentRouter = express.Router();

// POST - Create a new assignment for a specific course
assignmentRouter.post('/:courseId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const { title, description, dueDate } = req.body;
    const {courseId} = req.params
// console.log("Req:", req.body);
    // if (!mongoose.Types.ObjectId.isValid(course)) {
    //   return res.status(400).json({ error: 'Invalid course ID' });
    // }
  
    try {
      const assignment = new Assignment({
        title,
        description,
        dueDate,
        course : courseId,
    });
  
      const savedAssignment = await assignment.save();
      console.log("SavedAssignment:", savedAssignment)
      res.status(201).json(savedAssignment);
    } catch (error) {
      console.error('Error creating assignment:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // GET - Fetch a specific assignment by courseId
assignmentRouter.get('/:courseId', authenticate, async (req, res) => {
    const { courseId } = req.params;

    try {
        const assignments = await Assignment.find({ course: courseId }).populate('course', 'title');
        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ error: 'Assignments not found' });
        }
        const count = await Assignment.countDocuments({ course: courseId });

        console.log(`Fetched ${count} assignments for Course ID: ${courseId}`);
        
        res.status(200).json({assignments, count});
    } catch (error) {
        console.error('Error fetching assignment by courseId:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET - Fetch a specific assignment by assignmentId
assignmentRouter.get('/:assignmentId',authenticate, async (req, res) => {
    const assignmentId = req.params.assignmentId;

    try {
        const assignment = await Assignment.findById({assignmentId});
        if (!assignment) {
            return res.status(404).send('Assignment not found');
        }
        console.log("ass:", assignment);
        res.status(200).json(assignment);
    } catch (error) {
        console.error('Error fetching assignment by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT - Update a specific assignment by assignmentId
assignmentRouter.put('/:assignmentId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const assignmentId = req.params.assignmentId;
    const { title, description, dueDate } = req.body;

    try {
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            assignmentId,
            { title, description, dueDate },
            { new: true, runValidators: true }
        );

        if (!updatedAssignment) {
            return res.status(404).send('Assignment not found');
        }

        res.status(200).json(updatedAssignment);
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE - Delete a specific assignment by assignmentId
assignmentRouter.delete('/:assignmentId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
    const assignmentId = req.params.assignmentId;

    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);
        if (!deletedAssignment) {
            return res.status(404).send('Assignment not found');
        }
        res.status(200).json(deletedAssignment);
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).send('Internal Server Error');
    }
});

assignmentRouter.get('/completed/:studentId', async (req, res) => {
    try {
      const { studentId } = req.params;
      const completedAssignments = await Assignment.find({ studentId, status: 'completed' }).countDocuments();
      res.json({ completedAssignments });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching completed assignments.' });
    }
  });

export default assignmentRouter;
