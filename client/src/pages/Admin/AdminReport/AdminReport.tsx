import React, { useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { message, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';
import { getAllReports } from '../../../apicalls/reports';
import { useEffect } from 'react';
import moment from 'moment';

const AdminReport = () => {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    examName: '',
    userName: ''
  });

  const columns = [
    {
      title: 'Exam Name',
      dataIndex: 'examName',
      render: (text: any, record: any) => <>{record.exam.name}</>
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      render: (text: any, record: any) => <>{record.user.name}</>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text: any, record: any) => (
        <>{moment(record.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</>
      )
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalQuestions',
      render: (text: any, record: any) => <>{record.exam.totalMarks}</>
    },
    {
      title: 'Passing Marks',
      dataIndex: 'correctAnswers',
      render: (text: any, record: any) => <>{record.exam.passingMarks}</>
    },
    {
      title: 'Obtained Marks',
      dataIndex: 'correctAnswers',
      render: (text: any, record: any) => (
        <>{record.result.correctAnswers.length}</>
      )
    },
    {
      title: 'Result',
      dataIndex: 'verdict',
      render: (text: any, record: any) => <>{record.result.verdict}</>
    }
  ];
  const getData = async (tempFilters: object) => {
    try {
      dispatch(showLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="my-3 border-b-2"></div>
      <div className="flex gap-2 items-center ">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <button
          className="rounded-lg bg-blue-800 text-white h-8 font-semibold px-2 flex items-center"
          onClick={() => {
            setFilters({
              examName: '',
              userName: ''
            });
            getData({
              examName: '',
              userName: ''
            });
          }}
        >
          Clear
        </button>
        <button
          className="rounded-lg bg-green-900 text-white h-8 font-semibold px-2 flex items-center"
          onClick={() => getData(filters)}
        >
          Search
        </button>
      </div>
      <div className="bg-white rounded">
        <Table columns={columns} dataSource={reportsData} className="mt-2" />
      </div>
    </div>
  );
};

export default AdminReport;
