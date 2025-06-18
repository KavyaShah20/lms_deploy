import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation, useRemoveCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });
    const params = useParams();
    const courseId = params.courseId;
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();

    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();

    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId);

    const [publishCourse, { }] = usePublishCourseMutation();

    const [removeCourse, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess, }] = useRemoveCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };

    const selectCourseLevl = (value) => {
        setInput({ ...input, courseLevel: value });
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreviewThumbnail(fileReader.result);
            }
            fileReader.readAsDataURL(file);
        }
    }

    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("coursePrice", input.coursePrice);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("courseThumbnail", input.courseThumbnail);
        await editCourse({ formData, courseId });
    }

    const removeCourseHandler = async () => {
        await removeCourse(courseId);
    };

    const publicStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                refetch();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to publish or unpublish course");
        }
    }

    useEffect(() => {
        if (removeSuccess) {
            navigate(`/admin/courses`),
                toast.success(removeData.message);
            refetch();
        }
    }, [removeSuccess]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course Updated.")
        }
        if (error) {
            toast.error(data.message || "Failed to update the course")
        }
    }, [isSuccess, error]);

    const course = courseByIdData?.course;
    useEffect(() => {
        if (course) {
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",
            })
        }
    }, [course]);

    if (courseByIdLoading) return <h1>Loading...</h1>


    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you are done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0} variant='outline' onClick={() => publicStatusHandler(courseByIdData?.course.isPublished ? 'false' : 'true')}>
                        {
                            courseByIdData?.course.isPublished ? "Unpublish" : "Publish"
                        }
                    </Button>
                    <Button disabled={removeLoading} variant='destructive' onClick={removeCourseHandler}>
                        {
                            removeLoading ? <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait
                            </> : "Remove Course"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input type="text" name="courseTitle" value={input.courseTitle} onChange={changeEventHandler} placeholder="Ex. Fullstack Devloper"></Input>
                    </div>
                    <div>
                        <Label>SubTitle</Label>
                        <Input type="text" name="subTitle" value={input.subTitle} onChange={changeEventHandler} placeholder="Ex. Become a Fullstack Developer from zero to hero in 2 months"></Input>
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5 '>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="NextJS">NextJS</SelectItem>
                                        <SelectItem value="DataScience">Data Science</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevl}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="text"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder='999'
                                className="w-fit"></Input>
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className='w-fit'>
                        </Input>
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-64 my-2' alt='Course Thumbnail' />
                            )
                        }
                    </div>
                    <div>
                        <Button variant="Outline" onClick={() => navigate("/admin/courses")}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please Wait
                                    </>) : "Save"
                            }</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab
