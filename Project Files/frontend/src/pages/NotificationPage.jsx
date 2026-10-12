import React from 'react';
import Layout from '../components/Layout.jsx';
import { Tabs, message, Button, Card, Empty, Badge } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationPage = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mark all notifications as read
    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/user/get-all-notification',
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                dispatch(setUser(res.data.data));
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong marking notifications');
        }
    };

    // Delete all read notifications
    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/user/delete-all-notification',
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                dispatch(setUser(res.data.data));
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong deleting notifications');
        }
    };

    const unreadCount = user?.notification?.length || 0;
    const readCount = user?.seennotification?.length || 0;

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <i className="fa-regular fa-bell" style={{ marginRight: '6px' }}></i>
                    Unread <Badge count={unreadCount} style={{ backgroundColor: '#0284c7', marginLeft: '6px' }} />
                </span>
            ),
            children: (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <Button 
                            type="primary" 
                            disabled={unreadCount === 0}
                            onClick={handleMarkAllRead}
                            style={{ backgroundColor: '#0284c7' }}
                        >
                            Mark All As Read
                        </Button>
                    </div>
                    {user?.notification && user.notification.length > 0 ? (
                        user.notification.map((item, index) => (
                            <Card 
                                key={index} 
                                style={{ marginBottom: '12px', cursor: 'pointer', borderLeft: '4px solid #0284c7', borderRadius: '8px' }}
                                onClick={() => item.onClickPath && navigate(item.onClickPath)}
                                hoverable
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i className="fa-solid fa-bell" style={{ color: '#0284c7', fontSize: '1.2rem', marginRight: '14px' }}></i>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 500, color: '#1e293b' }}>
                                            {typeof item === 'object' ? item.message : item}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Empty description="No unread notifications" />
                    )}
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <span>
                    <i className="fa-solid fa-check-double" style={{ marginRight: '6px' }}></i>
                    Read ({readCount})
                </span>
            ),
            children: (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <Button 
                            danger 
                            disabled={readCount === 0}
                            onClick={handleDeleteAllRead}
                        >
                            Delete All Read
                        </Button>
                    </div>
                    {user?.seennotification && user.seennotification.length > 0 ? (
                        user.seennotification.map((item, index) => (
                            <Card 
                                key={index} 
                                style={{ marginBottom: '12px', borderLeft: '4px solid #94a3b8', borderRadius: '8px', opacity: 0.85 }}
                                hoverable
                                onClick={() => item.onClickPath && navigate(item.onClickPath)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i className="fa-solid fa-envelope-open" style={{ color: '#64748b', fontSize: '1.1rem', marginRight: '14px' }}></i>
                                    <div>
                                        <p style={{ margin: 0, color: '#475569' }}>
                                            {typeof item === 'object' ? item.message : item}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Empty description="No read notifications" />
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div style={{ maxWidth: 850, margin: '0 auto', padding: '10px' }}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
                    <i className="fa-solid fa-bell" style={{ marginRight: '10px', color: '#0284c7' }}></i>
                    Notification Center
                </h2>
                <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                    <Tabs defaultActiveKey="1" items={items} />
                </Card>
            </div>
        </Layout>
    );
};

export default NotificationPage;
