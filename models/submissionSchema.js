// import mongoose from 'mongoose'; 

// const submissionSchema = new mongoose.Schema({
//     assignment: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Assignment',
//         required: true
//     },
//     student: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     submissionUrl: {
//         type: String,
//         required: true
//     },
//     grade: {
//         type: Number, // Represents marks for the submission
//         min: 0, // Minimum value for marks (if needed)
//         max: 10, // Maximum value for marks (if needed)
//     },
//     comments: {
//         type: String // Optional comments for feedback
//     }
// }, { timestamps: true });

// const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

// export default Submission;
