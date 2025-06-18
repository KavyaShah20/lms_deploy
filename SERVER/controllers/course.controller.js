import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category fields are required."
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id,
        });
        return res.status(201).json({
            course,
            message: "Course Created"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
};

export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], SortByPrice = "" } = req.query

        //create search query
        const searchCriteria = {
            isPublished: true,
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        }
        //if categories selected 
        if (categories.length > 0) {
            searchCriteria.category = { $in: categories };
        }

        //define sorting order
        const sortOptions = {};
        if (SortByPrice === "low") {
            sortOptions.coursePrice = 1;
        }
        else if (SortByPrice === "high") {
            sortOptions.coursePrice = -1;
        }

        let courses = await Course.find(searchCriteria).populate({ path: "creator", select: "name photoUrl" }).sort(sortOptions)

        return res.status(200).json({
            success: true,
            courses: courses || []
        })
    } catch (error) {
        console.log(error)
    }
}

export const getPublishCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });
        if (!courses) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"
        })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                Courses: [],
                message: "Courses not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({

            message: "Failed to load the course"
        })
    }
};

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, coursePrice, courseLevel } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        console.log(course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        };
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split('/').pop().split('.')[0];
                await deleteMediaFromCloudinary(publicId);
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        };

        const updateData = { courseTitle, subTitle, description, category, coursePrice, courseLevel, courseThumbnail: courseThumbnail?.secure_url };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            course,
            message: 'Course updated successfully'
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({

            message: "Failed to load the course"
        })
    }
};

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            course,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({

            message: "Failed to get course by id"
        })
    }
};

export const removeCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Find all lectures associated with this course
        const lectures = await Lecture.find({ _id: { $in: course.lectures } });

        // Delete each lecture's video from Cloudinary
        for (const lecture of lectures) {
            if (lecture.publicId) {
                await deleteVideoFromCloudinary(lecture.publicId);
            }
        }

        // Delete all lectures from the database
        await Lecture.deleteMany({ _id: { $in: course.lectures } });

        // Finally, delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course and associated lectures removed successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove course"
        });
    }
};

//Lecture.controller.js

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const courseId = req.params.courseId;
        if (!courseId || !lectureTitle) {
            return res.status(404).json({
                message: "Lecture title is required."
            })
        };

        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(201).json({
            message: "Lecture created successfully",
            lecture,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture"
        })
    }
};

export const getCourseLecture = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        // console.log(courseId);
        const course = await Course.findById(courseId).populate("lectures");
        // console.log(course);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Course found succesfully",
            lectures: course.lectures
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lectures"
        })
    }
};

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        // console.log(lectureTitle, videoInfo, isPreviewFree);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lectures"
        })
    }
};

// export const editLecture = async (req, res) => {
//     try {
//         const { lectureTitle, videoInfo, isPreviewFree } = req.body;
//         const { lectureId } = req.params;

//         // Find the lecture
//         const lecture = await Lecture.findById(lectureId);
//         if (!lecture) {
//             return res.status(404).json({
//                 message: "Lecture not found"
//             });
//         }

//         // Update lecture details if provided
//         if (lectureTitle) lecture.lectureTitle = lectureTitle;
//         if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
//         if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
//         lecture.isPreviewFree = isPreviewFree;

//         await lecture.save(); // Save the updated lecture

//         return res.status(200).json({
//             lecture,
//             message: "Lecture updated successfully"
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Failed to edit lecture"
//         });
//     }
// };


export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "lecture not found"
            })
        }
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }
        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );

        return res.status(200).json({
            message: "Lecture removed successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture"
        })
    }
};

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "lecture not found"
            })
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by id"
        })
    }
};


//Publish unpublish course

export const togglePublishCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { publish } = req.query; //true or false
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        };
        course.isPublished = publish === 'true';
        await course.save();
        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status"
        })
    }
}