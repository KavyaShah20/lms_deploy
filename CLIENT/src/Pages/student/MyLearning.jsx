import React from 'react'
import Course from './Course';
import { Skeleton } from '@/components/ui/skeleton';
import { useLoadUserQuery } from '@/features/api/authapi';

const MyLearning = () => {
    const { data, isLoading } = useLoadUserQuery();
    const myLearning = data?.user?.enrolledCourses || [];
    return (
        <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
            <h1 className='font-bold text-2xl'>MY LEARNING</h1>
            <div className='my-5'>
                {
                    isLoading ?
                        (

                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                {
                                    myLearning.map((course, index) => <MyLearningSkeleton key={index} />)
                                }
                            </div>

                        )
                        : myLearning.length === 0 ? (<p>You are not enrolled in any course</p>) :
                            (

                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                    {
                                        myLearning.map((course, index) => <Course key={index} course={course} />)
                                    }
                                </div>

                            )
                }
            </div>
        </div>
    )
}

export default MyLearning

const MyLearningSkeleton = () => {
    return (

        <div className='bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden'>
            <Skeleton className="w-full h-36" />
            <div className='px-5 py-4 space-y-3'>
                <Skeleton className='h-6 w-3/4' />
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Skeleton className='h-6 w-6 rounded-full' />
                        <Skeleton className='h-4 w-20' />
                    </div>
                    <Skeleton className='h-4 w-16' />
                </div>
                <Skeleton className='h-4 w-1/4' />
            </div>
        </div>


    );
};

