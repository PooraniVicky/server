import express from 'express';
import Submission from '../models/submissionSchema.js';
import mongoose from 'mongoose';
import { authenticate, authorize } from '../middleware/auth.js';

const submissionRouter = express.Router();

// Submit a new submission
submissionRouter.post('/:assignmentId', authenticate, async (req, res) => {
    const assignmentId = req.params.assignmentId;
    const { submissionUrl } = req.body;
    const student = req.userId; // Assuming req.userId is set by your authentication middleware

    try {
        const submissionData = { assignment: assignmentId, student, submissionUrl };
        const submissions = await Submission.create(submissionData);
        res.status(201).send(submissions);
        console.log("Assignment Submission:", submissions);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Fetch all submissions for a specific course
submissionRouter.get('/:courseId', authenticate, async (req, res) => {
    const { courseId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid courseId format.' });
        }

        const submissions = await Submission.find({ course: courseId }).populate('student', 'firstName lastName');
        const submissionCount = await Submission.countDocuments({ course: courseId });

        res.send({ submissions, count: submissionCount });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Fetch all submissions for a specific assignment
submissionRouter.get('/:assignmentId', authenticate, async (req, res) => {
    const assignmentId = req.params.assignmentId;

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).send({ message: 'Invalid assignmentId format.' });
        }

        // Fetch submissions
        const submissions = await Submission.find({ assignmentId })
            .populate('student', 'firstName lastName'); // Adjust field names as needed

        console.log("Submission By AssId:", submissions);
        res.send({ submissions });
    } catch (err) {
        console.error('Error fetching submissions by assignmentId:', err.message);
        res.status(500).send({ message: 'Failed to fetch submissions.' });
    }
});



// submissionRouter.get('/:assignmentId', authenticate, async (req, res) => {
//     const assignmentId = req.params.assignmentId;

//     try {
//         console.log("AssignmentId:". assignmentId);
//         if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
//             return res.status(400).send({ message: 'Invalid assignmentId format.' });
//         }

//         const submissions = await Submission.find({ assignment: mongoose.Types.ObjectId(assignmentId) }).populate('student', 'firstName lastName');
//         console.log("Submission By AssId:", submissions);
//         res.send( submissions );
//     } catch (err) {
//         console.error('Error fetching submissions by assId:', err);
//         res.status(500).send({ message: 'Failed to fetch submissions.' });
//     }
// });


// Grade a submission
submissionRouter.put('/:submissionId/grade', authenticate, authorize(['admin', 'instructor']), async (req, res) => {

        const { submissionId } = req.params;
        const { grade, comments } = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({ message: 'Invalid submission ID' });
        }
    
        try {
            const submission = await Submission.findByIdAndUpdate(
                submissionId,
                { grade, comments },
                { new: true }
            );
    
            if (!submission) {
                return res.status(404).json({ message: 'Submission not found' });
            }
    
            res.status(200).json(submission);
        } catch (error) {
            console.error('Error grading submission:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
    submissionRouter.delete('/:submissionId', authenticate, authorize(['admin', 'instructor']), async (req, res) => {
        const { submissionId } = req.params;
  
        try {
       await Submission.findByIdAndDelete(submissionId);
            
            // Send success response
        res.status(200).json({ message: 'Submission deleted successfully.' });
        } catch (error) {
            res.status(500).send(error);
        }
    });

export default submissionRouter;
