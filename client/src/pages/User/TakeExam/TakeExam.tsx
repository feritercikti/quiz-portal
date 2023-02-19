import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../../../apicalls/exams';
import { addReport } from '../../../apicalls/reports';
import { hideLoading, showLoading } from '../../../redux/loaderSlice';
import { RootState } from '../../../redux/store';
import Instructions from './Instructions';

interface View {
  section: string;
}

const TakeExam = () => {
  const [examData, setExamData] = useState<any>(null);
  const [questions, setQuestions] = useState<[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [result, setResult] = useState<any>({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState<View>({ section: 'instructions' });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState<any>();

  const { user } = useSelector((state: RootState) => state.users);

  const getExamData = async () => {
    try {
      dispatch(showLoading());
      const response = await getExamById({
        examId: params.id
      });
      dispatch(hideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      // eslint-disable-next-line prefer-const
      let correctAnswers: never[] = [];
      // eslint-disable-next-line prefer-const
      let wrongAnswers: never[] = [];
      questions.forEach((question, index) => {
        if (question?.['correctOption'] === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
      let verdict = 'Pass';
      if (correctAnswers.length < examData?.passingMarks) {
        verdict = 'Fail';
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict
      };
      setResult(tempResult);
      dispatch(showLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user?.['_id']
      });
      dispatch(hideLoading());
      if (response.success) {
        setView({ section: 'result' });
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds: number = examData?.['duration'] as unknown as number;
    const intervalId = window.setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view.section === 'questions') {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  return (
    examData && (
      <div className="mt-2">
        <div className="my-3 border-b-2"></div>
        <h1 className="text-white text-xl text-center">{examData?.['name']}</h1>
        <div className="my-3 border-b-2"></div>
        {view.section === 'instructions' && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}
        {view.section === 'questions' && (
          <div className="flex flex-col gap-2 text-white">
            <div className="flex justify-between gap-10">
              <h1 className="text-xl  ">
                {selectedQuestionIndex + 1}: {''}
                {questions[selectedQuestionIndex]?.['name']}
              </h1>
              <div className="bg-black rounded-[50%] p-2 flex items-center justify-center h-12 w-12 ">
                <span className="text-2xl">{secondsLeft}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex]?.['options']).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col bg-white cursor-pointer text-black ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? 'shadow-[rgba(255,255,255,0.628)_0_0_1.px] p-2 bg-slate-400 border-solid border-2 border-sky-500 rounded'
                          : 'shadow-[rgba(0,0,0,0.638)_0_0_1.5px] p-2 rounded'
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option
                        });
                      }}
                    >
                      <h1>
                        {option}:{' '}
                        {questions[selectedQuestionIndex]?.['options'][option]}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>
            <div className="flex justify-between">
              {selectedQuestionIndex > 0 && (
                <button
                  className="rounded-lg bg-blue-800 text-white h-8 font-semibold px-2 flex items-center"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                  }}
                >
                  Previous
                </button>
              )}
              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="rounded-lg bg-blue-800 text-white h-8 font-semibold px-2 flex items-center"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Next
                </button>
              )}
              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="rounded-lg bg-green-800 text-white h-8 font-semibold px-2 flex items-center"
                  onClick={() => {
                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
        {view.section === 'result' && (
          <div className="flex items-center mt-2 justify-center result text-white">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">RESULT</h1>
              <div className="my-3 border-b-2"></div>
              <div className="marks">
                <h1 className="text-md">Total Marks: {examData?.totalMarks}</h1>
                <h1 text-md>Obtained Marks :{result.correctAnswers.length}</h1>
                <h1 text-md>Wrong Marks :{result.wrongAnswers.length}</h1>
                <h1 text-md>Passing Marks :{examData.passingMarks}</h1>
                <h1 className="text-md">RESULT: {result.verdict}</h1>

                <div className="flex gap-2 mt-2">
                  <button
                    className="rounded-lg bg-green-800 text-white h-8 font-semibold px-2 flex items-center"
                    onClick={() => {
                      setView({ section: 'instructions' });
                      setSelectedQuestionIndex(0);
                      setSelectedOptions({});
                      setSecondsLeft(examData.duration);
                    }}
                  >
                    Retake Exam{' '}
                  </button>
                  <button
                    className="rounded-lg bg-blue-800 text-white h-8 font-semibold px-2 flex items-center"
                    onClick={() => {
                      setView({ section: 'review' });
                    }}
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {view.section === 'review' && (
          <div className="flex flex-col gap-2 text-white">
            {questions.map((question, index) => {
              const isCorrect =
                question?.['correctOption'] === selectedOptions[index];
              return (
                <div
                  className={`flex flex-col gap-1 p-2 ${
                    isCorrect ? 'bg-[#6fbf71]' : 'bg-[#e47943]'
                  }`}
                >
                  <h1>
                    {index + 1} : {question?.['name']}
                  </h1>
                  <h1 className="">
                    Submitted Answer: {selectedOptions[index]} - {''}
                    {question?.['options'][selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md ">
                    Correct Answer : {question?.['correctOption']} -{' '}
                    {question?.['options'][question?.['correctOption']]}
                  </h1>
                </div>
              );
            })}
            <div className="flex justify-center gap-2">
              <button
                className="rounded-lg bg-red-800 text-white h-8 font-semibold px-2 flex items-center"
                onClick={() => {
                  navigate('/');
                }}
              >
                Close
              </button>
              <button
                className="rounded-lg bg-blue-800 text-white h-8 font-semibold px-2 flex items-center"
                onClick={() => {
                  setView({ section: 'instructions' });
                  setSelectedQuestionIndex(0);
                  setSelectedOptions({});
                  setSecondsLeft(examData.duration);
                }}
              >
                Retake Exam
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default TakeExam;
