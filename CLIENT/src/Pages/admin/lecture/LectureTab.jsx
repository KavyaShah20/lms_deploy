import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
const BASE_URL = import.meta.env.VITE_BASE_URL; 
const MEDIA_API = `${BASE_URL}/api/v1/media`;
const LectureTab = () => {
    const [lectureTitle, setLectureTitle] = useState('');
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);

    const params = useParams();
    const { courseId, lectureId } = params;
    const navigate = useNavigate();
    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess, }] = useRemoveLectureMutation();
    const { data: lectureData } = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total))
                    }
                });
                if (res.data.success) {
                    console.log(res);
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setBtnDisable(false);
                    toast.success(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error('Video upload failed');
            }
            finally {
                setMediaProgress(false)
            }
        }
    };

    const editLectureHandler = async () => {
        console.log(uploadVideoInfo, isPreviewFree);
        await editLecture({ lectureTitle, videoInfo: uploadVideoInfo, courseId, lectureId, isPreviewFree })
    };

    const removeLectureHandler = async () => {
        await removeLecture(lectureId);
    };

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle);
            setIsPreviewFree(lecture.isPreviewFree);
            setUploadVideoInfo(lecture.videoInfo);
        }
    }, [lecture]);
    useEffect(() => {
        if (isSuccess) {
            navigate(`/admin/courses/${courseId}/lecture`),
            toast.success(data.message);
        }
        if (error) {
            toast.error(error.data.message);
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (removeSuccess) {
            navigate(`/admin/courses/${courseId}/lecture`),
            toast.success(removeData.message);
        }
    }, [removeSuccess]);


    return (
        <Card>
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle>
                        Edit Lecture
                    </CardTitle>
                    <CardDescription>
                        Make changes and click save when done.
                    </CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button disabled={removeLoading} variant='destructive' onClick={removeLectureHandler}>
                        {
                            removeLoading ? <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait
                            </> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        type="text"
                        placeholder='Ex. Introduction to Javascript'
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        type="file"
                        placeholder='Ex. Introduction to Javascript'
                        onChange={fileChangeHandler}
                        className="w-fit"
                        accept="video/*"
                    />
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch checked={isPreviewFree} onCheckedChange={setIsPreviewFree} id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Is this video FREE?</Label>
                </div>

                {
                    mediaProgress && (
                        <div className='my-4'>
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }

                <div className='mt-4'>
                    <Button disabled={isLoading} onClick={editLectureHandler}>
                        {
                            isLoading ? <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please Wait
                            </> : "Update Lecture"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab
