import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;
    const { data: lectureData, isLoading: lectureLoading, isError: lectureError, refetch } = useGetCourseLectureQuery(courseId);

    const [createLecture, { data, isLoading, error, isSuccess }] = useCreateLectureMutation();
    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    };


    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data.message);
        }
        if (error) {
            toast.error(error.data.message);
        }
    }, [isSuccess, error]);

    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Let's add lectures and some basic lecture details for your new course</h1>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, nemo!</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} placeholder="Your lecture name"></Input>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="outline" onClick={() => navigate(`/admin/courses/${courseId}`)}>Back to course</Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin'>Please Wait</Loader2>
                                </>
                            ) : "Create lecture"
                        }
                    </Button>
                </div>
                <div className='mt-10'>
                    {
                        lectureLoading ? (<p>Loading Lecture...</p>)
                            : lectureError ? (<p>Failed to load lectures </p>)
                                : lectureData.lectures.length === 0 ? (<p>No lectures available</p>)
                                    : (
                                        lectureData.lectures.map((lecture, index) => (
                                            <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />))
                                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateLecture
