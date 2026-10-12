import React from 'react';
import Layout from '../components/Layout.jsx';
import { useSelector } from 'react-redux';
import { Card, Tag, Avatar, Button, Descriptions, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Profile = () => {
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();

    return (
        <Layout>
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '10px' }}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
                    <i className="fa-solid fa-id-card" style={{ marginRight: '10px', color: '#0284c7' }}></i>
                    Account Profile
                </h2>
                
                {user && (
                    <Card 
                        bordered={false} 
                        style={{ borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <Avatar 
                                size={72} 
                                style={{ backgroundColor: '#0284c7', fontSize: '2rem', fontWeight: 600 }}
                            >
                                {user.name ? user.name[0].toUpperCase() : 'U'}
                            </Avatar>
                            <div>
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', color: '#0f172a' }}>
                                    {user.name}
                                </h3>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {user.isAdmin && <Tag color="magenta">System Administrator</Tag>}
                                    {user.isDoctor && <Tag color="blue">Verified Doctor</Tag>}
                                    {!user.isAdmin && !user.isDoctor && <Tag color="green">Patient</Tag>}
                                </div>
                            </div>
                        </div>

                        <Divider style={{ margin: '16px 0' }} />

                        <Descriptions title="Personal Information" bordered column={{ xs: 1, sm: 2 }}>
                            <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone Number">{user.phone || 'Not specified'}</Descriptions.Item>
                            <Descriptions.Item label="Doctor Status">
                                {user.isDoctor ? (
                                    <Tag color="success">Approved Doctor</Tag>
                                ) : (
                                    <Tag color="default">Standard User</Tag>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Member Since">
                                {user.createdAt ? moment(user.createdAt).format('DD MMM YYYY') : 'Active Member'}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {user.isDoctor && (
                                <Button 
                                    type="primary" 
                                    onClick={() => navigate('/doctor/profile')}
                                    style={{ backgroundColor: '#0284c7' }}
                                >
                                    <i className="fa-solid fa-user-doctor" style={{ marginRight: '6px' }}></i>
                                    Doctor Settings & Timings
                                </Button>
                            )}
                            {!user.isDoctor && !user.isAdmin && (
                                <Button 
                                    type="default" 
                                    onClick={() => navigate('/apply-doctor')}
                                >
                                    <i className="fa-solid fa-stethoscope" style={{ marginRight: '6px' }}></i>
                                    Apply as Doctor
                                </Button>
                            )}
                            <Button 
                                type="primary" 
                                onClick={() => navigate('/appointments')}
                                style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                            >
                                <i className="fa-solid fa-calendar-check" style={{ marginRight: '6px' }}></i>
                                My Appointments
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default Profile;