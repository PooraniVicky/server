import express from 'express';
import Lesson from '../models/lessonSchema.js';
import { authenticate, authorize } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

// multer config
const storage = multer.diskStorage({});
const upload = multer({ storage });

const lessonRouter = express.Router();

// Create a new lesson under a specific course
lessonRouter.post('/:courseId', authenticate, authorize(['instructor', 'admin']), upload.array("media"), async (req, res) => {
    const {
        session,
        description,
    } = req.body;
    const courseId = req.params.course._id; // Extract courseId from params
    try {
        // Uploading media (images, videos)
        const mediaUrls = [];
        console.log(req.files);
        for (let file of req.files) {
            let Data = await cloudinary.uploader.upload(file.path);
            console.log(Data);
            mediaUrls.push(Data.url);
        }

        const lesson = new Lesson({
            session,
            description,
            image: mediaUrls.filter(url => url.endsWith('.jpg') || url.endsWith('.png')),
            video: mediaUrls.filter(url => url.endsWith('.mp4') || url.endsWith('.mov')),
            course: courseId, // Assign courseId to the lesson
            quiz,
            user: req.userId,
        });

        await lesson.save();
        res.status(201).send(lesson);
        console.log(lesson)
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(400).send(error);
    }
});

// Get all lessons for a specific course
lessonRouter.get('/:courseId', authenticate, async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const lessons = await Lesson.find({ course: courseId });
        res.send(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).send(error);
    }
});

// Get lesson by ID within a specific course
lessonRouter.get('/:courseId/:id', authenticate, async (req, res) => {
    const { courseId, id } = req.params;
    try {
        const lesson = await Lesson.findOne({ _id: id, course: courseId });
        if (!lesson) {
            return res.status(404).send('Lesson not found');
        }
        res.send(lesson);
    } catch (error) {
        console.error('Error fetching lesson by ID:', error);
        res.status(500).send(error);
    }
});

// Update lesson by ID within a specific course
lessonRouter.put('/:courseId/:id', authenticate, authorize(['instructor', 'admin']), async (req, res) => {
    const { courseId, id } = req.params;
    const {
        session,
        description,
        image,
        video,
        quiz
    } = req.body;
    try {
        const lesson = await Lesson.findOneAndUpdate({ _id: id, course: courseId }, {
            session,
            description,
            image,
            video,
            quiz
        }, { new: true });
        if (!lesson) {
            return res.status(404).send('Lesson not found');
        }
        res.send(lesson);
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(400).send(error);
    }
});

// Delete lesson by ID within a specific course
lessonRouter.delete('/:courseId/:id', authenticate, authorize(['admin']), async (req, res) => {
    const { courseId, id } = req.params;
    try {
        const lesson = await Lesson.findOneAndDelete({ _id: id, course: courseId });
        if (!lesson) {
            return res.status(404).send('Lesson not found');
        }
        res.send(lesson);
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).send(error);
    }
});

export default lessonRouter;
