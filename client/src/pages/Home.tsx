import { message } from 'antd';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '../apicalls/exams';
import { hideLoading, showLoading } from '../redux/loaderSlice';
import { RootState } from '../redux/store';

interface Exam {
  _id: number;
  name: string;
  duration: number;
  category: string;
  questions: [];
}

const Home = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllExams();
      dispatch(hideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExamsData();
  }, []);

  return (
    <div className="flex flex-col pb-8 relative">
      <div className="flex justify-end gap-3 float-right absolute -top-10 right-0 m-5 text-white">
        {user && (
          <div className="flex gap-1 items-center justify-center ">
            <h1 className="text-md text-white text-l ">Hi, {user?.['name']}</h1>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center mt-8">
        <h1 className="text-white text-2xl">QUIZZES</h1>
        <div className="grid grid-cols-3 gap-6 mt-10 max-[720px]:grid-cols-2 max-[420px]:grid-cols-1">
          {exams.map((exam, index) => (
            <div
              className="p-3 bg-white w-[400px] max-[768px]:w-[200px] max-[820px]:w-[250px] max-[1278px]:w-[275px] rounded mt-2"
              key={index}
            >
              <h3>{exam?.name}</h3>
              <div className="border-b-2 mt-2"></div>
              <h5>Category: {exam?.category}</h5>
              <h6>Number of Questions: {exam?.questions.length}</h6>
              <p>Duration (in seconds): {exam?.duration}</p>
              <button
                className="py-0 px-6 rounded-lg bg-green-400 h-8 font-semibold hover:bg-green-900 hover:text-white float-right"
                onClick={() => navigate(`/user/take-exam/${exam._id}`)}
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
