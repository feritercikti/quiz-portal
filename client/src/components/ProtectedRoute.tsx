import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../apicalls/users';
import { hideLoading, showLoading } from '../redux/loaderSlice';
import { RootState } from '../redux/store';
import { setUser } from '../redux/usersSlice';

type ChildrenProps = {
  children?: React.ReactNode;
};

type Menu = {
  title: string;
  paths: string[];
  icon: JSX.Element;
  onClick: () => void;
};

const ProtectedRoute = ({ children }: ChildrenProps) => {
  const { user } = useSelector((state: RootState) => state.users);

  const [menu, setMenu] = useState<Menu[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userMenu: Menu[] = [
    {
      title: 'Home',
      paths: ['/', '/user/take-exam'],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate('/')
    },
    {
      title: 'Reports',
      paths: ['/user/reports'],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate('/user/reports')
    },
    {
      title: 'Profile',
      paths: ['/profile'],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate('/profile')
    },
    {
      title: 'Logout',
      paths: ['/logout'],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  ];

  const adminMenu: Menu[] = [
    {
      title: 'Home',
      paths: ['/', '/user/take-exam'],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate('/')
    },
    {
      title: 'Exams',
      paths: ['/admin/exams', '/admin/exams/add'],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate('/admin/exams')
    },
    {
      title: 'Reports',
      paths: ['/admin/reports'],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate('/admin/reports')
    },
    {
      title: 'Profile',
      paths: ['/profile'],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate('/profile')
    },
    {
      title: 'Logout',
      paths: ['/logout'],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  ];

  const getUserData = async () => {
    try {
      dispatch(showLoading());
      const response = await getUserInfo();
      dispatch(hideLoading());
      if (response.success) {
        dispatch(setUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
      navigate('/login');
      dispatch(hideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUserData();
    } else {
      navigate('/login');
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths: string[]) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes('/admin/exams/edit') &&
        paths.includes('/admin/exams')
      ) {
        return true;
      }
      if (
        activeRoute.includes('/user/take-exam') &&
        paths.includes('/user/take-exam')
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className=" h-screen ">
      <div className="flex gap-2 w-full h-full bg-slate-900 fixed overflow-y-auto">
        {user && (
          <div className="p-2  h-full flex items-center justify-center bg-white top-0 sticky">
            <div className="bg-white">
              <div className="body">
                <div className="header flex justify-between py-2">
                  <i
                    className="ri-menu-line cursor-pointer px-4 py-2 mx-1 hover:bg-slate-700 hover:rounded hover:text-white"
                    onClick={() => setCollapsed((prev) => !prev)}
                  ></i>
                </div>
              </div>
              {menu.map((item, index) => {
                return (
                  <div
                    className={`flex items-center cursor-pointer px-4 py-2 m-1 gap-4  hover:bg-slate-700 hover:rounded hover:text-white ${
                      getIsActiveOrNot(item.paths) &&
                      'bg-slate-700 rounded text-white'
                    }`}
                    key={index}
                    onClick={item.onClick}
                  >
                    {item?.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="mx-auto mt-[50px] mb-[100px] h-full">{children}</div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
