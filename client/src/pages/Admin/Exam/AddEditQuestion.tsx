import { Form, message, Modal } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addQuestionToExam, editQuestionById } from '../../../apicalls/exams';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';

interface AddEditProps {
  setShowAddEditQuestionModal: any;
  showAddEditQuestionModal: any;
  examId: any;
  refreshData: () => void;
  selectedQuestion: any;
  setSelectedQuestion: any;
}

interface QuestionType {
  [x: string]: any;
  name: string;
  correctOption: string;
  options?: object;
  exam: number;
}

const AddEditQuestion = (props: AddEditProps) => {
  const dispatch = useDispatch();

  const onFinish = async (values: QuestionType) => {
    try {
      dispatch(showLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D
        },
        exam: props.examId
      };

      let response;
      if (props.selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: props.selectedQuestion._id
        });
      } else {
        response = await addQuestionToExam(requiredPayload);
      }
      if (response.success) {
        message.success(response.message);
        props.refreshData();
        props.setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      props.setSelectedQuestion(null);
      dispatch(hideLoading());
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={props.selectedQuestion ? 'Edit Question' : 'Add Question'}
      open={props.showAddEditQuestionModal}
      footer={false}
      onCancel={() => {
        props.setShowAddEditQuestionModal(false);
        props.setSelectedQuestion(null);
      }}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: props.selectedQuestion?.name,
          A: props.selectedQuestion?.options?.A,
          B: props.selectedQuestion?.options?.B,
          C: props.selectedQuestion?.options?.C,
          D: props.selectedQuestion?.options?.D,
          correctOption: props.selectedQuestion?.correctOption
        }}
      >
        <Form.Item name="name" label="Question">
          <input type="text" />
        </Form.Item>
        <Form.Item name="correctOption" label="Correct Option">
          <input type="text" />
        </Form.Item>

        <div className="flex gap-3">
          <Form.Item name="A" label="Option A">
            <input type="text" />
          </Form.Item>
          <Form.Item name="B" label="Option B">
            <input type="text" />
          </Form.Item>
        </div>
        <div className="flex gap-3">
          <Form.Item name="C" label="Option C">
            <input type="text" />
          </Form.Item>
          <Form.Item name="D" label="Option D">
            <input type="text" />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-2 gap-3">
          <button
            className="rounded-lg bg-red-900 text-white h-8 font-semibold px-2 flex items-center"
            type="button"
            onClick={() => props.setShowAddEditQuestionModal(false)}
          >
            Cancel
          </button>
          <button className="rounded-lg bg-green-900 text-white h-8 font-semibold px-2 flex items-center">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditQuestion;
