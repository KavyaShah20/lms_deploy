import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AddCourse = () => {
    const [courseTitle, setCourseTitle] = useState("");
    const [category, setCategory] = useState("");

    const [createCourse, { data, error, isSuccess, isLoading }] = useCreateCourseMutation();

    const navigate = useNavigate();
    const getSelectedCategory = (value) => {
        // setCategory(value);
        setCategory(value);
    };
    const createCourseHandler = async () => {
        await createCourse({ courseTitle, category });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course created.");
            navigate('/admin/courses')
        }
    }, [isSuccess, error]
    )
    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Let's add some basic course details for your new course</h1>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, nemo!</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" name="courseTitle" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Your course name"></Input>
                </div>
                <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={getSelectedCategory}>
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
                <div className='flex items-center gap-2'>
                    <Button variant="outline" onClick={() => navigate('/admin/courses')}>Back</Button>
                    <Button disabled={isLoading} onClick={createCourseHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin'>Please Wait</Loader2>
                                </>
                            ) : "Create"
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddCourse
