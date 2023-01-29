import { message, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllReportsByUser } from '../../../apicalls/reports';
import PageTitle from '../../../components/PageTitle';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';

const UserReports = () => {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();
  const columns = [
    {
      title: 'Exam Name',
      dataIndex: 'examName',
      render: (text: any, record: any) => <>{record.exam.name}</>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text: any, record: any) => (
        <>{moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss')}</>
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

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllReportsByUser();
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
    getData();
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="my-3 border-b-2 "></div>
      <div className="bg-white rounded">
        <Table
          columns={columns}
          dataSource={reportsData}
          className="text-white"
        />
      </div>
    </div>
  );
};

export default UserReports;
