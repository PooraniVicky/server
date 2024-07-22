import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    session: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: [{
        type: String, // Assuming image will be stored as a URL or path
    }],
    video: [{
        type: String, // Assuming video will be stored as a URL or path
        
            }],
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
}, { timestamps: true });

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

export default Lesson;
