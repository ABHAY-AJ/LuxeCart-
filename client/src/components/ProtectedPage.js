import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../apicalls/users';
import { Avatar, Badge, message } from 'antd';
import { SetLoader } from '../redux/loadersSlice';
import { SetUser } from '../redux/usersSlice';
import Notifications from './Notifications';
import { GetAllNotifications, ReadAllNotifications } from "../apicalls/notifications";

function ProtectedPage({ children }) {
    const [notifications = [], setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const validateToken = async () => {
        try {
            dispatch(SetLoader(true))
            const response = await GetCurrentUser();
            dispatch(SetLoader(false))
            console.log('Response:', response);

            if (response.success) {
                dispatch(SetUser(response.data));
            } else {
                navigate("/login");
                const errorMsg = response.message || 'Error: Invalid response';
                console.log('Error Message:', errorMsg);
                message.error(errorMsg);
            }
        } catch (error) {
            dispatch(SetLoader(false))
            const errorMsg = error.message || 'Error: Something went wrong';
            console.error('Error:', errorMsg); // Debugging statement
            message.error(errorMsg);
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


    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
            getNotifications()
        } else {
            navigate("/login");
        }
    }, []);

    return (user &&
        <div>

            {/* header */}
            <div
                className='flex justify-between items-center bg-primary p-5'>

                <h1 className='text-2xl cursor-pointer text-white'
                    onClick={() => navigate("/")}>
                    SHEY MP
                </h1>

                <div className='bg-white py-2 px-5 rounded flex gap-1 item-center'>
                    <i className="ri-shield-user-line"></i>
                    <span
                        className='underline cursor-pointer uppercase'
                        onClick={() => {
                            if (user.role === "user") {
                                navigate("/profile");
                            } else {
                                navigate("/admin");
                            }
                        }}>
                        {user.name}
                    </span>

                    <Badge count={
                        notifications?.filter((notification) => !notification.read).length
                    }
                        onClick={() => {
                            readNotifications();
                            setShowNotifications(true)
                        }}
                        className='cursor-pointer'
                    >
                        <Avatar shape='circle' size='small'
                            icon={<i className='ri-notification-3-line'></i>}
                        />
                    </Badge>

                    <i className="ri-logout-box-r-line ml-10"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}></i>
                </div>

            </div>
            <div className='p-5'>

                {children}
            </div>

            {
                <Notifications
                    notifications={notifications}
                    reloadNotifications={getNotifications}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                />
            }

        </div>
    );
}

export default ProtectedPage;
