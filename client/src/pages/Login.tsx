import React from 'react';
import { Link } from 'react-router-dom';
import { Form, message } from 'antd';
import axios from 'axios';
import { loginUser } from '../apicalls/users';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const onFinish = async (values: FormData) => {
    try {
      const response = await loginUser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem('token', response.data);
        window.location.href = '/';
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-900">
      <div className="p-3 bg-white w-[400px] rounded ">
        <div className="flex flex-col">
          <h1 className="text-center font-bold">LOGIN</h1>
          <div className="border-b-2 mt-2"></div>
          <Form layout="vertical" className="mt-2" onFinish={onFinish}>
            <Form.Item name="email" label="Email">
              <input type="text" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <input type="password" />
            </Form.Item>
            <div className="flex items-center justify-center gap-10 pt-5">
              <button className="py-0 px-6 rounded-lg bg-slate-400 h-8 font-semibold hover:bg-slate-900 hover:text-white">
                Login
              </button>
              <Link to="/register">Register Now</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
