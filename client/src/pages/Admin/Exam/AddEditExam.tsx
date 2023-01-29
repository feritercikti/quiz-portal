import React, { useEffect, useState } from 'react';
import { Col, Form, message, Row, Select, Table } from 'antd';
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById
} from '../../../apicalls/exams';
import PageTitle from '../../../components/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';
import { Tabs } from 'antd';
import AddEditQuestion from './AddEditQuestion';

const { TabPane } = Tabs;

interface ExamProps {
  name: string;
  duration: number;
  category: string;
  totalMarks: number;
  passingMarks: number;
  questions: [];
}

const AddEditExam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<ExamProps>();
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const params = useParams();

  const onFinish = async (values: object) => {
    try {
      dispatch(showLoading());
      let response;

      if (params.id) {
        response = await editExamById({
          ...values,
          examId: params.id
        });
      } else {
        response = await addExam(values);
      }
      if (response.success) {
        message.success(response.message);
        navigate('/admin/exams');
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(showLoading());
      const response = await getExamById({
        examId: params.id
      });
      dispatch(hideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  const deleteQuestion = async (questionId: number) => {
    try {
      dispatch(showLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id
      });
      dispatch(hideLoading);
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const questionsColumns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      render: (id: number, record: any, index: number) => {
        ++index;
        return index;
      },
      showSorterTooltip: false
    },
    {
      title: 'Question',
      dataIndex: 'name'
    },
    {
      title: 'Options',
      dataIndex: 'options',
      render: (text: any, record: any) => {
        return Object.keys(record.options).map((key, index) => {
          return (
            <div key={index}>
              {key} : {record.options[key]}
            </div>
          );
        });
      }
    },
    {
      title: 'Correct Option',
      dataIndex: 'correctOption',
      render: (
        text: any,
        record: {
          correctOption: string | number;
          options: { [x: string]: any };
        }
      ) => {
        return ` ${record.correctOption} : ${
          record.options[record.correctOption]
        }`;
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text: any, record: any) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line cursor-pointer rounded text-lg hover:bg-slate-200 px-1"
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line cursor-pointer rounded text-lg hover:bg-slate-200 px-1"
            onClick={() => {
              deleteQuestion(record._id);
            }}
          ></i>
        </div>
      )
    }
  ];

  return (
    <div className="pb-8 ">
      <PageTitle title={params.id ? 'Edit Exam' : 'Add Exam'} />
      <div className="my-3 border-b-2"></div>

      {(examData || !params.id) && (
        <Form layout="vertical" onFinish={onFinish} initialValues={examData}>
          <div className="bg-white px-4 rounded py-2 ">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Exam Details" key="1">
                <Row gutter={[10, 10]}>
                  <Col span={8}>
                    <Form.Item label="Exam Name" name="name">
                      <input type="text" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Duration (in sec)" name="duration">
                      <input type="number" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Category" name="category">
                      <input type="text" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Total Marks" name="totalMarks">
                      <input type="number" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Passing Marks" name="passingMarks">
                      <input type="number" />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="flex justify-end  gap-3">
                  <button
                    className="rounded-lg bg-red-900 text-white h-8 font-semibold px-2 flex items-center"
                    type="button"
                    onClick={() => navigate('/admin/exams')}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-lg bg-green-900 text-white h-8 font-semibold px-2 flex items-center"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </TabPane>
              {params.id && (
                <TabPane tab="Questions" key="2">
                  <div className="flex justify-end">
                    <button
                      className="rounded-lg bg-green-900 text-white h-8 font-semibold px-2 flex items-center"
                      type="button"
                      onClick={() => setShowAddEditQuestionModal(true)}
                    >
                      Add Question
                    </button>
                  </div>
                  <Table
                    columns={questionsColumns}
                    dataSource={examData?.questions || []}
                  />
                </TabPane>
              )}
            </Tabs>
          </div>
        </Form>
      )}
      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
    </div>
  );
};

export default AddEditExam;
