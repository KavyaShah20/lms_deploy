// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import React from 'react'

// const Dashboard = () => {
//   return (
//     <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Sales</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className='text-3xl font-bold text-blue-600'>400</p>
//         </CardContent>
//       </Card>
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Revenue</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className='text-3xl font-bold text-blue-600'>1200</p>
//         </CardContent>
//       </Card>
//       <Card>

//       </Card>
//     </div>
//   )
// }

// export default Dashboard

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';

const data = [
  { name: 'Jan', sales: 200 },
  { name: 'Feb', sales: 300 },
  { name: 'Mar', sales: 250 },
  { name: 'Apr', sales: 400 },
  { name: 'May', sales: 350 },
  { name: 'Jun', sales: 500 },
];

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1 className='text-red-500'>Failed to get purchased course</h1>
  const { purchasedCourse } = data || [];
  const courseData = purchasedCourse.map((course) => (
    {
      name: course?.courseId?.courseTitle,
      price: course?.courseId?.coursePrice
    }
  ))

  const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
  const totalSales = purchasedCourse.length;

  return (
    <div>
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-blue-600'>{totalSales}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-blue-600'>₹{totalRevenue}</p>
          </CardContent>
        </Card>

      </div>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 mt-5">
        <CardHeader>
          <CardTitle>Course Price</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
