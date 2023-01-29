import React from 'react';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import TakeExam from './pages/User/TakeExam/TakeExam';
import UserReports from './pages/User/UserReport/UserReports';
import AddEditExam from './pages/Admin/Exam/AddEditExam';
import AdminReport from './pages/Admin/AdminReport/AdminReport';
import ProtectedRoute from './components/ProtectedRoute';
import Exams from './pages/Admin/Exam/Exams';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Loader from './components/Loader';

function App() {
  const { loading } = useSelector((state: RootState) => state.loader);

  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/take-exam/:id"
            element={
              <ProtectedRoute>
                <TakeExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/reports"
            element={
              <ProtectedRoute>
                <UserReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/exams/add"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/exams/edit/:id"
            element={
              <ProtectedRoute>
                <AddEditExam />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
