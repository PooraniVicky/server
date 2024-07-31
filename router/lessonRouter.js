// import express from 'express';
// import Lesson from '../models/lessonSchema.js';
// import { authenticate, authorize } from '../middleware/auth.js';

// const lessonRouter = express.Router();

// // Create a new lesson
// lessonRouter.post('/lesson/:courseId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
//     try {
//         const { courseId } = req.params;
//         const lesson = new Lesson({ ...req.body, course: courseId });
//         await lesson.save();
//         res.status(201).json(lesson);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Get all lessons for a course
// // Get all lessons for a specific course
// // lessonRouter.get('/lesson/:courseId', authenticate, async (req, res) => {
// //     try {
// //         const { courseId } = req.params;
// //         // Validate courseId
// //         if (!courseId) {
// //             return res.status(400).json({ message: 'Course ID is required' });
// //         }

// //         // Find lessons for the given courseId
// //         const lessons = await Lesson.find({ course: courseId }).populate('course');

// //         // If no lessons are found
// //         if (!lessons.length) {
// //             return res.status(404).json({ message: 'No lessons found for this course' });
// //         }

// //         res.json(lessons);
// //     } catch (error) {
// //         console.error('Error fetching lessons:', error);
// //         res.status(500).json({ message: 'Internal Server Error' });
// //     }
// // });
// // Get all lessons for a specific course
// lessonRouter.get('/lesson/course/:courseId', authenticate, async (req, res) => {
//     try {
//         const { courseId } = req.params;

//         // Validate courseId
//         if (!courseId) {
//             return res.status(400).json({ message: 'Course ID is required' });
//         }

//         // Find lessons for the given courseId
//         const lessons = await Lesson.find({ course: courseId }).populate('course');

//         // If no lessons are found
//         if (!lessons.length) {
//             return res.status(404).json({ message: 'No lessons found for this course' });
//         }

//         res.json(lessons);
//     } catch (error) {
//         console.error('Error fetching lessons:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// lessonRouter.get('/lesson/:lessonId', authenticate, async (req, res) => {
//     try {
//       const { lessonId } = req.params;
  
//       if (!lessonId) {
//         return res.status(400).json({ message: 'Lesson ID is required' });
//       }
  
//       const lesson = await Lesson.findById(lessonId).populate('course');
  
//       if (!lesson) {
//         return res.status(404).json({ message: 'Lesson not found' });
//       }
  
//       res.status(200).json(lesson);
//     } catch (error) {
//       console.error('Error fetching lesson:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  
// // Update a lesson by ID
// lessonRouter.put('/lesson/:id', authenticate, async (req, res) => {
//     try {
//         const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         if (lesson) {
//             res.json(lesson);
//         } else {
//             res.status(404).json({ message: 'Lesson not found' });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Delete a lesson by ID
// lessonRouter.delete('/lesson/:id', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
//     try {
//         const lesson = await Lesson.findByIdAndDelete(req.params.id);
//         if (lesson) {
//             res.json({ message: 'Lesson deleted' });
//         } else {
//             res.status(404).json({ message: 'Lesson not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Mark a lesson as completed
// lessonRouter.post('/lesson/:id/complete', authenticate, async (req, res) => {
//   // Extracting id from req.params
//   let { id } = req.params.id;
//   const { userId, isCompleted } = req.body;

//   // Log the entire req.params to inspect the structure
//   console.log("req.params:", req.params.id);
//   console.log("Received id:", id);
//   console.log("Type of id:", typeof id);

//   // Check if id is indeed a string or needs conversion
//   if (typeof id === 'object') {
//     console.error("id is an object, converting to string:", id);
//     id = id.toString();
//       console.log("ReceivedId:", id);

//   }

//   try {
//     const lesson = await Lesson.findById(id);
//     if (!lesson) {
//       return res.status(404).json({ message: "Lesson not found" });
//     }

//     // Update the completion status for the specified user
//     const result = await Lesson.updateOne(
//       { _id: id, "completionStatus.userId": userId },
//       { $set: { "completionStatus.$.isCompleted": isCompleted } }
//     );

//     if (result.nModified === 0) {
//       const lessonWithUser = await Lesson.findOne({ _id: id, "completionStatus.userId": userId });
//       if (!lessonWithUser) {
//         await Lesson.updateOne(
//           { _id: id },
//           { $push: { completionStatus: { userId, isCompleted } } }
//         );
//         res.status(200).json({ message: "Lesson completion status added for new user" });
//       } else {
//         res.status(400).json({ message: "Lesson completion status not updated" });
//       }
//     } else {
//       res.status(200).json({ message: "Lesson completion status updated" });
//     }
//   } catch (error) {
//     console.error('Error updating lesson status:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

  
// // Fetch course progress
// lessonRouter.get('/course/:courseId/progress', authenticate, async (req, res) => {
//     try {
//         const { courseId } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(courseId)) {
//             return res.status(400).json({ message: 'Invalid Course ID' });
//         }
//         const lessons = await Lesson.find({ course: courseId }).populate('student');
//         const totalLessons = lessons.length;
//         const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
//         const progress = (completedLessons / totalLessons) * 100;

//         res.json({ progress });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Fetch completed students for a lesson
// lessonRouter.get('/lesson/:lessonId/completed-students', authenticate, async (req, res) => {
//     try {
//         const lesson = await Lesson.findById(req.params.lessonId);
//         if (!lesson) {
//             return res.status(404).json({ message: "Lesson not found" });
//         }

//         const completedStudents = lesson.completionStatus.filter(status => status.isCompleted).map(status => status.userId);
//         res.json(completedStudents);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// export default lessonRouter;
import express from 'express';
import mongoose from 'mongoose';
import Lesson from '../models/lessonSchema.js';
import { authenticate, authorize } from '../middleware/auth.js';

const lessonRouter = express.Router();

// Create a new lesson
lessonRouter.post('/lesson/:courseId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
    try {
        const { courseId } = req.params;
        const lesson = new Lesson({ ...req.body, course: courseId });
        await lesson.save();
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all lessons for a specific course
lessonRouter.get('/lesson/course/:courseId', authenticate, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }

        // Find lessons for the given courseId
        const lessons = await Lesson.find({ course: courseId }).populate('course');

        // If no lessons are found
        if (!lessons.length) {
            return res.status(404).json({ message: 'No lessons found for this course' });
        }

        res.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get a single lesson by ID
lessonRouter.get('/lesson/:lessonId', authenticate, async (req, res) => {
    try {
        const { lessonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ message: 'Invalid Lesson ID' });
        }

        const lesson = await Lesson.findById(lessonId).populate('course');

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.status(200).json(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a lesson by ID
lessonRouter.put('/lesson/:lessonId', authenticate, async (req, res) => {
    try {
        const { lessonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ message: 'Invalid Lesson ID' });
        }

        const lesson = await Lesson.findByIdAndUpdate(lessonId, req.body, { new: true, runValidators: true });

        if (lesson) {
            res.json(lesson);
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a lesson by ID
lessonRouter.delete('/lesson/:lessonId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
    try {
        const { lessonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ message: 'Invalid Lesson ID' });
        }

        const lesson = await Lesson.findByIdAndDelete(lessonId);

        if (lesson) {
            res.json({ message: 'Lesson deleted' });
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark a lesson as completed or pending
// lessonRouter.post('/lesson/:lessonId/complete', authenticate, async (req, res) => {
//     const { lessonId } = req.params;
//     const { userId, completionStatus } = req.body;

//     try {
//         // Validate the lesson ID
//         if (!mongoose.Types.ObjectId.isValid(lessonId)) {
//             return res.status(400).json({ message: 'Invalid lesson ID' });
//         }

//         const lesson = await Lesson.findById(lessonId);
//         if (!lesson) {
//             return res.status(404).json({ message: "Lesson not found" });
//         }

//         // Update completion status and handle completed students array
//         if (completionStatus === 'completed') {
//             if (!lesson.completedStudents.includes(userId)) {
//                 lesson.completedStudents.push(userId);
//             }
//         } else if (completionStatus === 'pending') {
//             lesson.completedStudents = lesson.completedStudents.filter(studentId => studentId.toString() !== userId);
//         }

//         await lesson.save();
//         res.status(200).json({ message: "Lesson completion status updated" });
//     } catch (error) {
//         console.error('Error updating lesson status:', error);
//         res.status(500).json({ message: error.message });
//     }
// });
// Mark a lesson as completed or pending
lessonRouter.post('/lesson/:lessonId/complete', authenticate, async (req, res) => {
  const { lessonId } = req.params;
  const { userId, completionStatus } = req.body;

  try {
      // Validate the lesson ID
      if (!mongoose.Types.ObjectId.isValid(lessonId)) {
          return res.status(400).json({ message: 'Invalid lesson ID' });
      }

      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
          return res.status(404).json({ message: "Lesson not found" });
      }

      // Update completion status and handle completed students array
      if (completionStatus === 'completed') {
          if (!lesson.completedStudents.includes(userId)) {
              lesson.completedStudents.push(userId);
          }
          lesson.completionStatus = 'completed';  // Set completion status to completed
      } else if (completionStatus === 'pending') {
          lesson.completedStudents = lesson.completedStudents.filter(studentId => studentId.toString() !== userId);
          lesson.completionStatus = 'pending';  // Set completion status to pending
      }

      await lesson.save();
      res.status(200).json({ message: "Lesson completion status updated" });
  } catch (error) {
      console.error('Error updating lesson status:', error);
      res.status(500).json({ message: error.message });
  }
});

// Fetch course progress
lessonRouter.get('/course/:courseId/progress', authenticate, async (req, res) => {
    try {
        const { courseId } = req.params;
console.log("courseId:", courseId);
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }

        const lessons = await Lesson.find({ course: courseId }).populate('completedStudents');
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(lesson => lesson.completedStudents.length > 0).length;
        const progress = (completedLessons / totalLessons) * 100;

        res.json({ progress });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch completed students for a lesson
lessonRouter.get('/lesson/:lessonId/completed-students', authenticate, async (req, res) => {
    try {
        const { lessonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ message: 'Invalid Lesson ID' });
        }

        const lesson = await Lesson.findById(lessonId).populate('completedStudents');
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        res.json(lesson.completedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default lessonRouter;
