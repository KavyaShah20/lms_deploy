// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardTitle } from '@/components/ui/card'
// import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi'
// import { CheckCircle, CheckCircle2, CirclePlay, Video } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { toast } from 'sonner'

// const CourseProgress = () => {
//   const params = useParams();
//   const courseId = params.courseId;

//   const [currentLecture, setCurrentLecture] = useState(null);
//   const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
//   // const courseDetails = data?.data?.courseDetails;
//   // const progress = data?.data?.progress;
//   // const completed = data?.data?.completed;

//   const [updateLectureProgress] = useUpdateLectureProgressMutation();
//   const [completeCourse, { data: markCompleteData, isSuccess: completeSuccess }] = useCompleteCourseMutation();
//   const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompleteSuccess }] = useInCompleteCourseMutation();

//   useEffect(() => {
//     if (completeSuccess) {
//       toast.success(markCompleteData.message);
//     }
//     if (inCompleteSuccess) {
//       toast.success(markInCompleteData.message)
//     }
//     refetch();
//   }, [completeSuccess, inCompleteSuccess, markCompleteData, markInCompleteData])
//   if (isLoading) return <p>Loading...</p>
//   if (isError) return <p>Failed to load course details</p>

//   const { courseDetails, progress, completed } = data.data;
//   const initialLecture = currentLecture || courseDetails?.lectures && courseDetails?.lectures[0];

//   const { courseTitle } = courseDetails;
//   const isLectureCompleted = (lectureId) => {
//     return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
//   };


//   const handleSelectLecture = (lecture) => {
//     setCurrentLecture(lecture)
//   };

//   const handleLectureProgress = async (lectureId) => {
//     // console.log(lectureId, courseId);
//     await updateLectureProgress({ courseId, lectureId });
//     refetch();
//   }
//   const handleCompleteCourse = async () => {
//     await completeCourse(courseId);
//   };

//   const handleInCompleteCourse = async () => {
//     await inCompleteCourse(courseId);
//   }



//   return (
//     <div className='max-w-7xl mx-auto p-4 mt-20'>
//       <div className='flex justify-between mb-4'>
//         <h1 className='text-2xl font-bold'>{courseDetails?.courseTitle}</h1>
//         <Button onClick={completed ? handleInCompleteCourse : handleCompleteCourse} variant={completed ? "outline" : "default"}>
//           {
//             completed ? <div className='flex items-center'><CheckCircle className='h-4 w-4 mr-2' /><span>Completed</span></div> : "Mark as completed"
//           }
//         </Button>
//       </div>
//       <div className='flex flex-col md:flex-row gap-6'>
//         <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
//           <div>
//             <video
//               src={currentLecture?.videoUrl || initialLecture.videoUrl}
//               controls
//               className='w-full h-auto md:rounded-lg'
//               onPlay={() => handleLectureProgress(currentLecture?._id || initialLecture?._id)}
//             />
//           </div>
//           <div className='mt-2'>
//             <h3 className='font-medium text-lg'>
//               {`Lecture ${courseDetails?.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`}
//             </h3>
//           </div>
//         </div>
//         <div className='flex flex-col w-full md:w-2/5 border-t-0 md:border-t-0 border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
//           <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
//           <div className='flex-1 overflow-y-auto'>
//             {
//               courseDetails?.lectures?.map((lecture) => (
//                 <Card key={lecture?._id} className={`mb-3 hover:cursor-pointer transition transform ${lecture?._id === currentLecture?._id ? "bg-gray-200" : "dark:bg-gray-800"}`} onClick={() => handleSelectLecture(lecture)}>
//                   <CardContent className="flex items-center justify-between p-4">
//                     <div className='flex items-center'>
//                       {
//                         isLectureCompleted(lecture._id) ? (<CheckCircle2 size={24} className='text-green-500 mr-2' />) : (<CirclePlay size={24} className='text-grey-500 mr-2' />)
//                       }
//                       <div>
//                         <CardTitle className="text-lg font-medium">{lecture?.lectureTitle}</CardTitle>
//                       </div>
//                     </div>
//                     {
//                       isLectureCompleted(lecture._id) && (<Badge variant={"outline"} className='bg-green-200 text-green-600' >Completed</Badge>)
//                     }
//                   </CardContent>
//                 </Card>
//               ))
//             }
//           </div>
//         </div>
//       </div>
//     </div >
//   )
// }

// export default CourseProgress

// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardTitle } from '@/components/ui/card'
// import { useGetCourseByIdQuery, useGetPublishedCourseQuery } from '@/features/api/courseApi'
// import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi'
// import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { toast } from 'sonner'
// import Certificate from '../admin/course/Certificate'
// import { useLoadUserQuery } from '@/features/api/authApi'

// const CourseProgress = () => {
//   const params = useParams();
//   const { data: userData, isLoading: userLoading } = useLoadUserQuery();
//   const courseId = params.courseId;
//   const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
//   const { data: courseData, isLoading: courseisLoading } = useGetCourseByIdQuery(courseId);
//   const [updateLectureProgress] = useUpdateLectureProgressMutation();
//   const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] = useCompleteCourseMutation();
//   const [incompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] = useIncompleteCourseMutation();
//   const [currentLecture, setCurrentLecture] = useState(null);

//   useEffect(() => {
//     if (completedSuccess) {
//       refetch();
//       toast.success(markCompleteData?.message);
//     }
//     if (inCompletedSuccess) {
//       refetch();
//       toast.success(markInCompleteData?.message);
//     }
//   }, [completedSuccess, inCompletedSuccess, markCompleteData, markInCompleteData]);

//   if (courseisLoading) {
//     return <p>Loading...</p>
//   }

//   if (isLoading) {
//     return <p>Loading...</p>
//   }
//   if (isError) {
//     return <p>Failed to load course details</p>
//   }

//   if(userLoading){
//     return <p>Loading...</p>
//   }

//   console.log(userData);
//   console.log(courseData);

//   // const {courseTitle} = courseDetails // aaam pan karay me direct karyu che
//   // console.log(data);
//   const { completed, courseDetails, progress } = data.data;
//   // initialize the first lecture
//   const initialLecture = currentLecture || courseDetails?.lectures && courseDetails?.lectures[0]
//   // const isCompleted = true
//   const isLectureCompleted = (lectureId) => {
//     return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
//   };

//   // Handle seelct a specific lecture to watch
//   const handleSelectLecture = (lecture) => {
//     setCurrentLecture(lecture);
//   }

//   const handleLecuteProgress = async (lectureId) => {
//     await updateLectureProgress({ courseId, lectureId });
//     refetch();
//   }

//   const handleCompleteCourse = async () => {
//     await completeCourse(courseId);
//   }
//   const handleInCompleteCourse = async () => {
//     await incompleteCourse(courseId);
//   }


//   return (
//     <div className='max-w-7xl mx-auto p-4 px-16 mt-20'>
//       {/* Display Course Name */}
//       <div className='flex justify-between mb-4'>
//         <h1 className='text-2xl font-bold'>{courseDetails?.courseTitle}</h1>
//         <Button onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
//           variant={completed ? "outline" : "default"}
//         >
//           {
//             completed ? <div className='flex items-center'><CheckCircle className='h-4 w-4 mr-2' /> <span>Completed</span></div> : "Mark as completed"
//           }
//         </Button>
//       </div>
//       <div className='flex flex-col md:flex-row gap-6'>
//         {/* Video Section  */}
//         <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
//           <div>
//             <video
//               src={currentLecture?.videoUrl || initialLecture?.videoUrl}
//               controls
//               className='w-full h-[auto] md:rounded-lg'
//               onPlay={() => handleLecuteProgress(currentLecture?._id || initialLecture._id)}
//             />
//           </div>
//           {/* Display current watching lecture title  */}
//           <div className='mt-2'>
//             <h3 className='font-medium text-lg'>
//               {
//                 Lecture ${courseDetails.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}
//               }
//             </h3>
//           </div>
//         </div>
//         {/* Lecture Sidebar  */}
//         <div className='felx flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
//           <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
//           <div className='flex-1 overflow-y-auto'>
//             {
//               courseDetails?.lectures?.map((lecture, index) => (
//                 <Card
//                   key={lecture._id}
//                   className={mb-3 hover:cursor-pointer transition transform ${lecture?._id === currentLecture?._id ? 'bg-gray-200' : "dark:bg-gray-800"}}
//                   onClick={() => handleSelectLecture(lecture)}
//                 >
//                   <CardContent className="flex items-center justify-between p-4">
//                     <div className='flex items-center'>
//                       {
//                         isLectureCompleted(lecture._id) ? (<CheckCircle2 size={24} className='text-green-500 mr-2' />) : (<CirclePlay size={24} className='text-gray-500 mr-2' />)
//                       }
//                       <div>
//                         <CardTitle className="text-lg font-medium">{lecture?.lectureTitle}</CardTitle>
//                       </div>
//                     </div>
//                     {
//                       isLectureCompleted(lecture._id) && (
//                         <Badge variant={"outline"} className={"bg-green-200 text-green-600"}>Completed</Badge>
//                       )
//                     }

//                   </CardContent>
//                 </Card>
//               ))
//             }
//           </div>
//           {courseData?.course?.courseTitle}
//           <Certificate
//             userId={userData?.user?._id}
//             courseId={courseData?.course?._id}
//             userName="John Doe"
//             courseName={courseData?.course?.courseTitle}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CourseProgress



import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useGetCourseByIdQuery } from '@/features/api/courseApi'
import { useGetCourseProgressQuery, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi'
import { CheckCircle2, CirclePlay } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Certificate from '../admin/course/Certificate'
import { useLoadUserQuery } from '@/features/api/authapi'

const CourseProgress = () => {
  const params = useParams();
  const { data: userData, isLoading: userLoading } = useLoadUserQuery();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const { data: courseData, isLoading: courseisLoading } = useGetCourseByIdQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [currentLecture, setCurrentLecture] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (data) {
      const allLecturesCompleted = data.data.courseDetails.lectures.every(lecture =>
        data.data.progress.some(prog => prog.lectureId === lecture._id && prog.viewed)
      );
      setIsCompleted(allLecturesCompleted);
    }
  }, [data]);

  if (courseisLoading || isLoading || userLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Failed to load course details</p>
  }

  const { courseDetails, progress } = data.data;

  const initialLecture = currentLecture || courseDetails?.lectures[0];

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  return (
    <div className='max-w-7xl mx-auto p-4 px-16 mt-20'>
      {/* Display Course Name */}
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl font-bold'>{courseDetails?.courseTitle}</h1>
        <Button disabled={isCompleted}>
          <div className='flex items-center'>
            <CheckCircle2 className='h-4 w-4 mr-2' />
            <span>Completed</span>
          </div>
        </Button>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        {/* Video Section */}
        <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className='w-full h-[auto] md:rounded-lg'
              onPlay={() => handleLectureProgress(currentLecture?._id || initialLecture._id)}
            />
          </div>
          <div className='mt-2'>
            <h3 className='font-medium text-lg'>
              {
                `Lecture ${courseDetails.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`
              }
            </h3>
          </div>
        </div>

        {/* Lecture Sidebar */}
        <div className='felx flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
          <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
          <div className='flex-1 overflow-y-auto'>
            {courseDetails?.lectures?.map((lecture, index) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${lecture?._id === currentLecture?._id ? 'bg-gray-200' : "dark:bg-gray-800"}`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className='flex items-center'>
                    {
                      isLectureCompleted(lecture._id) ? (<CheckCircle2 size={24} className='text-green-500 mr-2' />) : (<CirclePlay size={24} className='text-gray-500 mr-2' />)
                    }
                    <div>
                      <CardTitle className="text-lg font-medium">{lecture?.lectureTitle}</CardTitle>
                    </div>
                  </div>
                  {
                    isLectureCompleted(lecture._id) && (
                      <Badge variant={"outline"} className={"bg-green-200 text-green-600"}>Completed</Badge>
                    )
                  }
                </CardContent>
              </Card>
            ))}
          </div>
          {isCompleted && (
            <Certificate
              userId={userData?.user?._id}
              courseId={courseData?.course?._id}
              // userName="John Doe"
              userName={userData?.user?.name}
              courseName={courseData?.course?.courseTitle}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseProgress;