import React, { useEffect, useState } from 'react';
import { message, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { deleteExamById, getAllExams } from '../../../apicalls/exams';
import PageTitle from '../../../components/PageTitle';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';

const Exams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
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

  const deleteExam = async (examId: number) => {
    try {
      dispatch(showLoading());
      const response = await deleteExamById({
        examId
      });
      dispatch(hideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Exam Name',
      dataIndex: 'name'
    },
    {
      title: 'Duration per Question (sec)',
      dataIndex: 'duration'
    },
    {
      title: 'Total Questions',
      dataIndex: 'questions',
      render: (title: any, record: any) => {
        return <div>{record.questions.length}</div>;
      }
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalMarks'
    },
    {
      title: 'Passing Marks',
      dataIndex: 'passingMarks'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text: any, record: { _id: number }) => (
        <div className="flex gap-3">
          <i
            className="ri-pencil-line cursor-pointer rounded text-lg hover:bg-slate-200 px-1"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line cursor-pointer rounded text-lg hover:bg-slate-200 px-1"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      )
    }
  ];

  useEffect(() => {
    getExamsData();
  }, []);

  return (
    <div>
      <div className="flex justify-between mt-2 items-end">
        <PageTitle title="Exams" />
        <button
          className="rounded-lg bg-green-900 text-white h-8 font-semibold px-2 flex items-center"
          onClick={() => navigate('/admin/exams/add')}
        >
          <i className="ri-add-line"></i>
          Add Exam
        </button>
      </div>
      <div className="my-3 border-b-2 "></div>
      <Table
        columns={columns}
        dataSource={exams}
        className="bg-white rounded"
      />
    </div>
  );
};

export default Exams;
