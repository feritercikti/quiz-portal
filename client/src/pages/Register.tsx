import { Form } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-900">
      <div className="p-3 bg-white w-[400px] rounded ">
        <div className="flex flex-col">
          <h1 className="text-center font-bold">REGISTER</h1>
          <div className="border-b-2 mt-2"></div>
          <Form layout="vertical" className="mt-2">
            <Form.Item name="name" label="Name">
              <input type="text" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <input type="text" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <input type="password" />
            </Form.Item>
            <div className="flex items-center justify-center gap-10 pt-2">
              <button className="py-0 px-6 rounded-lg bg-slate-400 h-8 font-semibold hover:bg-slate-900 hover:text-white">
                Register
              </button>
              <Link to="/login">Go to Login</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
