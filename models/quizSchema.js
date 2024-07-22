import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
   
    questions: [{
        questionText: { 
            type: String, 
            required: true 
        },
        options: { 
            type: [String], 
            required: true 
        },
        correctAnswer: { 
            type: Number, 
            required: true 
        }
    }]
}, { timestamps: true });

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

export default Quiz;
