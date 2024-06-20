import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../apicalls/users';
import { Avatar, Badge, message, Menu, Dropdown, Spin } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { SetLoader } from '../redux/loadersSlice';
import { SetUser } from '../redux/usersSlice';
import Notifications from './Notifications';
import { GetAllNotifications, ReadAllNotifications } from "../apicalls/notifications";

function ProtectedPage({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const validateToken = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetCurrentUser();
            dispatch(SetLoader(false));
            
            if (response.success) {
                dispatch(SetUser(response.data));
            } else {
                handleLogout();
            }
        } catch (error) {
            handleLogout();
        }
    };

    const getNotifications = async () => {
        try {
            const response = await GetAllNotifications();
            
            if (response.success) {
                setNotifications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    }

    const readNotifications = async () => {
        try {
            const response = await ReadAllNotifications();
           
            if (response.success) {
                getNotifications();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(SetUser(null));
        navigate("/login");
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
            getNotifications();
        } else {
            navigate("/login");
        }
    }, []);

    const menu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => {
                if (user && user.role === "user") {
                    navigate("/profile");
                } else if (user) {
                    navigate("/admin");
                }
            }}>
                <i className="ri-shield-user-line"></i> {user && user.name}
            </Menu.Item>
            <Menu.Item key="notifications" onClick={() => {
                readNotifications();
                setShowNotifications(true);
            }}>
                <Badge count={notifications?.filter((notification) => !notification.read).length}>
                    <i className='ri-notification-3-line'></i> Notifications
                </Badge>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                <i className="ri-logout-box-r-line"></i> Logout
            </Menu.Item>
        </Menu>
    );

    return (
        user && (
            <div className='flex flex-col h-screen'>
                {/* Header */}
                <div className='bg-primary-gradient flex items-center justify-between p-5'>
                    <h1 className='text-2xl cursor-pointer text-white' onClick={() => navigate("/")}>
                        LuxeCart <i className="ri-shopping-bag-line"></i>
                    </h1>
                    <div className='flex items-center space-x-4 md:space-x-8'>
                        <div className='hidden md:flex items-center space-x-4'>
                            <span
                                className='cursor-pointer uppercase font-semibold text-white md:text-base'
                                onClick={() => {
                                    if (user.role === "user") {
                                        navigate("/profile");
                                    } else {
                                        navigate("/admin");
                                    }
                                }}>
                               <i className="ri-shield-user-line"></i> {user.name}
                            </span>
                            <Badge
                                count={notifications?.filter((notification) => !notification.read).length}
                                onClick={() => {
                                    readNotifications();
                                    setShowNotifications(true);
                                }}
                                className='cursor-pointer'
                            >
                                <Avatar
                                    shape='circle'
                                    size='small'
                                    icon={<i className='ri-notification-3-line'></i>}
                                />
                            </Badge>
                            <i
                                className="ri-logout-box-r-line cursor-pointer"
                                onClick={handleLogout}
                            ></i>
                        </div>
                        <Dropdown overlay={menu} trigger={['click']} className='md:hidden'>
                            <MenuOutlined className='text-white text-lg cursor-pointer' />
                        </Dropdown>
                    </div>
                </div>
                {/* Content */}
                <div className='flex-grow p-5'>
                    {children}
                </div>
                {/* Notifications */}
                <Notifications
                    notifications={notifications}
                    reloadNotifications={getNotifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                />
            </div>
        )
    );
}

export default ProtectedPage;
