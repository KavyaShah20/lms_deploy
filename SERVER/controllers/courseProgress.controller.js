import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js"

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");
        const courseDetails = await Course.findById(courseId).populate("lectures");
        if (!courseDetails) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        // if no progress found return course detail with empty progress
        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            })
        }

        //return course details with its progress
        return res.status(200).json({
            data: {
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed,
            }
        })
    } catch (error) {
        console.log(error)
    }
};

export const updatedLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        console.log(courseId, lectureId);
        const userId = req.id;
        let courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            //if no progress exist, create a new record
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            });
        }
        //find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);
        if (lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        } else {
            courseProgress.lectureProgress.push({
                lectureId, viewed: true,
            });
        }
        //if all lecture is complete
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed)
        const course = await Course.findById(courseId);
        if (course.lectures.length === lectureProgressLength) courseProgress.completed = true;
        await courseProgress.save();
        return res.status(200).json({
            message: "Lecture progress updated successfully"
        })
    } catch (error) {
        console.log(error)
    }
};

export const markAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({ courseId, userId });
        // console.log(courseProgress);
        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" })
        }
        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = true);
        courseProgress.completed = true;
        await courseProgress.save();
        return res.status(200).json({ message: "Course marked as completed" });
    } catch (error) {
        console.log(error);
    }
};

export const markAsInCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) return res.status(404).json({ message: "Course progress not found" })
        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = false);
        courseProgress.completed = false;
        await courseProgress.save();
        return res.status(200).json({ message: "Course marked as incompleted" });
    } catch (error) {
        console.log(error);
    }
};