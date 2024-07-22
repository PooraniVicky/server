import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    dueDate: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);

export default Assignment;
