// import express from 'express';
// import Quiz from '../models/quizSchema.js';
// import { authenticate, authorize } from '../middleware/auth.js';

// const quizRouter = express.Router();

// // Create a new quiz
// quizRouter.post('/:courseId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
//     const { title, questions } = req.body;
//     const { courseId } = req.params;
    
//     if (!courseId) {
//         return res.status(400).json({ message: 'Course ID is required' });
//     }
//     if (!title) {
//         return res.status(400).json({ message: 'Title is required' });
//     }
//     if (!questions || !Array.isArray(questions) || questions.length === 0) {
//         return res.status(400).json({ message: 'Questions are required and must be an array' });
//     }

//     try {
//         // Validate each question in the array
//         for (const question of questions) {
//             if (!question.questionText) {
//                 return res.status(400).json({ message: 'Each question must have a question text' });
//             }
//             if (!question.options || !Array.isArray(question.options) || question.options.length < 4) {
//                 return res.status(400).json({ message: 'Each question must have at least 4 options' });
//             }
//             if (question.correctAnswer === undefined || question.correctAnswer === null) {
//                 return res.status(400).json({ message: 'Each question must have a correct answer' });
//             }
//         }
//     // Check if courseId is valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(courseId)) {
//         return res.status(400).json({ error: 'Invalid courseId' });
//       }
  
//         const newQuiz = new Quiz({ course: courseId, title, questions });
//         await newQuiz.save();
//         res.status(201).json(newQuiz);
//     } catch (error) {
//         console.error('Error creating quiz:', error);
//         res.status(500).json({ message: 'Error creating quiz', error });
//     }
// });


// // Get all quizzes
// quizRouter.get('/:courseId', authenticate, async (req, res) => {
    
//     try {
//         const quizzes = await Quiz.find({course: req.params.courseId}).populate('course', 'title'); // Populate course details
//         res.send(quizzes);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // Get quiz by ID
// quizRouter.get('/:quizId', authenticate, async (req, res) => {
//     try {
//         const quizId = req.params.quizId;
//         const quiz = await Quiz.findById(quizId); // Assuming using Mongoose or similar
//     console.log("quizId:", quizId)
//         if (!quiz) {
//           return res.status(404).json({ error: 'Quiz not found' });
//         }
    
//         res.status(200).json(quiz); // Respond with quiz data
//       } catch (error) {
//         console.error('Error fetching quiz:', error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     });

// // Update quiz by ID
// quizRouter.put('/:quizId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
//     const { course, title, questions } = req.body;
//     const quizId = req.params.quizId;

//     try {
//         const quiz = await Quiz.findByIdAndUpdate(quizId, { course, title, questions }, { new: true });
//         if (!quiz) {
//             return res.status(404).send();
//         }
//         res.send(quiz);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// // Delete quiz by ID
// quizRouter.delete('/:quizId', authenticate, authorize(['admin']), async (req, res) => {
//     try {
//         const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
//         if (!quiz) {
//             return res.status(404).send();
//         }
//         res.send(quiz);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // grade quiz answers and calculate score
// quizRouter.post('/:quizId/grade', authenticate, async (req, res) => {
//     const { answers } = req.body;
//     const { quizId } = req.params;

//     try {
//         const quiz = await Quiz.findById(quizId);
//         if (!quiz) {
//             return res.status(404).json({ message: 'Quiz not found' });
//         }

//         let totalScore = 0;

//         quiz.questions.forEach((question, index) => {
//             const correctAnswer = question.correctAnswer;
//             const userAnswer = answers[index]; // Assuming answers are submitted as an array of selected options

//             if (correctAnswer === userAnswer) {
//                 totalScore += 5; // Add 5 points for each correct answer
//             }
//         });

//         // You might want to save the score to the user's profile or return it in the response
//         res.status(200).json({ score: totalScore });
//     } catch (error) {
//         console.error('Error submitting quiz:', error);
//         res.status(500).json({ message: 'Error submitting quiz', error });
//     }
// });

// export default quizRouter;
// import express from 'express';
// import mongoose from 'mongoose';
// import Quiz from '../models/quizSchema.js';
// import { authenticate, authorize } from '../middleware/auth.js';

// const quizRouter = express.Router();

// // Create a new quiz
// quizRouter.post('/:courseId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
//     const { title, questions } = req.body;
//     const { courseId } = req.params;

//     if (!courseId) {
//         return res.status(400).json({ message: 'Course ID is required' });
//     }
//     if (!title) {
//         return res.status(400).json({ message: 'Title is required' });
//     }
//     if (!questions || !Array.isArray(questions) || questions.length === 0) {
//         return res.status(400).json({ message: 'Questions are required and must be an array' });
//     }

//     try {
//         // Validate each question in the array
//         for (const question of questions) {
//             if (!question.questionText) {
//                 return res.status(400).json({ message: 'Each question must have a question text' });
//             }
//             if (!question.options || !Array.isArray(question.options) || question.options.length < 4) {
//                 return res.status(400).json({ message: 'Each question must have at least 4 options' });
//             }
//             if (question.correctAnswer === undefined || question.correctAnswer === null) {
//                 return res.status(400).json({ message: 'Each question must have a correct answer' });
//             }
//         }
        
//         // Check if courseId is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(courseId)) {
//             return res.status(400).json({ error: 'Invalid courseId' });
//         }

//         const newQuiz = new Quiz({ course: courseId, title, questions });
//         await newQuiz.save();
//         res.status(201).json(newQuiz);
//     } catch (error) {
//         console.error('Error creating quiz:', error);
//         res.status(500).json({ message: 'Error creating quiz', error });
//     }
// });

// // Get all quizzes
// quizRouter.get('/:courseId', authenticate, async (req, res) => {
//     try {
//         const quizzes = await Quiz.find({ course: req.params.courseId }).populate('course', 'title'); // Populate course details
//         res.send(quizzes);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // Get quiz by ID
// quizRouter.get('/:quizId', authenticate, async (req, res) => {
//     try {
//         const quizId = req.params.quizId;
//         const quiz = await Quiz.findById(quizId); // Assuming using Mongoose or similar
//         console.log("quizId:", quizId);
//         if (!quiz) {
//             return res.status(404).json({ error: 'Quiz not found' });
//         }

//         res.status(200).json(quiz); // Respond with quiz data
//     } catch (error) {
//         console.error('Error fetching quiz:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Update quiz by ID
// quizRouter.put('/:quizId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
//     const { course, title, questions } = req.body;
//     const quizId = req.params.quizId;

//     try {
//         const quiz = await Quiz.findByIdAndUpdate(quizId, { course, title, questions }, { new: true });
//         if (!quiz) {
//             return res.status(404).send();
//         }
//         res.send(quiz);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// // Delete quiz by ID
// quizRouter.delete('/:quizId', authenticate, authorize(['admin']), async (req, res) => {
//     try {
//         const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
//         if (!quiz) {
//             return res.status(404).send();
//         }
//         res.send(quiz);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // Grade quiz answers and calculate score
// quizRouter.post('/:quizId/grade', authenticate, async (req, res) => {
//     const { answers } = req.body;
//     const { quizId } = req.params;

//     try {
//         const quiz = await Quiz.findById(quizId);
//         if (!quiz) {
//             return res.status(404).json({ message: 'Quiz not found' });
//         }

//         let totalScore = 0;

//         quiz.questions.forEach((question, index) => {
//             const correctAnswer = question.correctAnswer;
//             const userAnswer = answers[index]; // Assuming answers are submitted as an array of selected options

//             if (correctAnswer === userAnswer) {
//                 totalScore += 5; // Add 5 points for each correct answer
//             }
//         });

//         // You might want to save the score to the user's profile or return it in the response
//         res.status(200).json({ score: totalScore });
//     } catch (error) {
//         console.error('Error submitting quiz:', error);
//         res.status(500).json({ message: 'Error submitting quiz', error });
//     }
// });

// export default quizRouter;
import express from 'express';
import mongoose from 'mongoose';
import Quiz from '../models/quizSchema.js';
import { authenticate, authorize } from '../middleware/auth.js';

const quizRouter = express.Router();

// Create a new quiz
quizRouter.post('/:courseId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
    const { title, questions } = req.body;
    const { courseId } = req.params;
    
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Valid Course ID is required' });
    }
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Questions are required and must be an array' });
    }

    try {
        // Validate each question in the array
        for (const question of questions) {
            if (!question.questionText) {
                return res.status(400).json({ message: 'Each question must have a question text' });
            }
            if (!question.options || !Array.isArray(question.options) || question.options.length < 4) {
                return res.status(400).json({ message: 'Each question must have at least 4 options' });
            }
            if (question.correctAnswer === undefined || question.correctAnswer === null) {
                return res.status(400).json({ message: 'Each question must have a correct answer' });
            }
        }
  
        const newQuiz = new Quiz({ course: courseId, title, questions });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Error creating quiz', error });
    }
});

// Get all quizzes and quiz count by course ID
quizRouter.get('/:courseId', authenticate, async (req, res) => {
    const { courseId } = req.params;


    try {
        console.log(`Fetching quizzes for Course ID: ${courseId}`);

        const quizzes = await Quiz.find({ course: courseId }).populate('course', 'title');
        const count = await Quiz.countDocuments({ course: courseId });

        console.log(`Fetched ${count} quizzes for Course ID: ${courseId}`);
        
        res.status(200).json({ quizzes, count });
    } catch (error) {
        //console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Error fetching quizzes', error });
    }
});


// Get quiz by ID
// quizRouter.get('/:quizId', authenticate, async (req, res) => {
//     const { quizId } = req.params;


//     try {
//         const quiz = await Quiz.findById(quizId);
//         if (!quiz) {
//             return res.status(404).json({ message: 'Quiz not found' });
//         }
//         res.status(200).json(quiz);
//     } catch (error) {
//         console.error('Error fetching quiz:', error);
//         res.status(500).json({ message: 'Internal server error', error });
//     }
// });
quizRouter.get('/:id', authenticate, async (req, res) => {
const { id } = req.params;
    
if (!id) {
    return res.status(400).json({ error: 'Quiz ID is required' });
}

try {
    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.json(quiz);
} catch (error) {
    console.error('Error fetching quiz by ID:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
}
});

// Update quiz by ID
quizRouter.put('/:quizId', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
    const { course, title, questions } = req.body;
    const { quizId } = req.params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({ message: 'Valid Quiz ID is required' });
    }

    try {
        const quiz = await Quiz.findByIdAndUpdate(quizId, { course, title, questions }, { new: true });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(400).json({ message: 'Error updating quiz', error });
    }
});

// Delete quiz by ID
quizRouter.delete('/:quizId', authenticate, authorize(['admin']), async (req, res) => {
    const { quizId } = req.params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({ message: 'Valid Quiz ID is required' });
    }

    try {
        const quiz = await Quiz.findByIdAndDelete(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz', error });
    }
});

// Grade quiz answers and calculate score
quizRouter.post('/:quizId/grade', authenticate, async (req, res) => {
    const { answers } = req.body;
    const { quizId } = req.params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({ message: 'Valid Quiz ID is required' });
    }

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let totalScore = 0;

        quiz.questions.forEach((question, index) => {
            const correctAnswer = question.correctAnswer;
            const userAnswer = answers[index]; // Assuming answers are submitted as an array of selected options

            if (correctAnswer === userAnswer) {
                totalScore += 5; // Add 5 points for each correct answer
            }
        });

        res.status(200).json({ score: totalScore });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Error submitting quiz', error });
    }
});
  
  quizRouter.get('/completed/:studentId', async (req, res) => {
    try {
      const { studentId } = req.params;
      const completedQuizzes = await Quiz.find({ studentId, status: 'completed' }).countDocuments();
      res.json({ completedQuizzes });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching completed quizzes.' });
    }
  });
  
export default quizRouter;
