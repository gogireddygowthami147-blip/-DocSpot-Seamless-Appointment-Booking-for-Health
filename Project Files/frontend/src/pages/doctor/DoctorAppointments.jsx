import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import axios from 'axios';
import { Table, Tag, message, Button, Card, Space } from 'antd';
import moment from 'moment';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch doctor's patient appointments
    const getDoctorAppointments = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/doctor/doctor-appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setLoading(false);
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error('Failed to load doctor appointments');
        }
    };

    // Handle appointment status change (Approve / Reject)
    const handleStatus = async (record, status) => {
        try {
            const res = await axios.post(
                '/api/v1/doctor/update-status',
                { appointmentId: record._id, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (res.data.success) {
                message.success(res.data.message);
                getDoctorAppointments();
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            message.error('Error updating appointment status');
        }
    };

    useEffect(() => {
        getDoctorAppointments();
    }, []);

    const columns = [
        {
            title: 'Patient Name',
            dataIndex: 'userInfo',
            render: (text, record) => {
                if (typeof record.userInfo === 'object' && record.userInfo !== null) {
                    return <span style={{ fontWeight: 600 }}>{record.userInfo.name}</span>;
                }
                return <span>{record.userInfo || 'N/A'}</span>;
            },
        },
        {
            title: 'Patient Phone',
            dataIndex: 'phone',
            render: (text, record) => {
                if (typeof record.userInfo === 'object' && record.userInfo !== null) {
                    return <span>{record.userInfo.phone}</span>;
                }
                return <span>-</span>;
            },
        },
        {
            title: 'Appointment Date',
            dataIndex: 'date',
            render: (text, record) => (
                <span>
                    <i className="fa-regular fa-calendar" style={{ marginRight: '6px', color: '#64748b' }}></i>
                    {record.date}
                </span>
            ),
        },
        {
            title: 'Time Slot',
            dataIndex: 'time',
            render: (text, record) => (
                <span>
                    <i className="fa-regular fa-clock" style={{ marginRight: '6px', color: '#64748b' }}></i>
                    {record.time}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => {
                let color = 'gold';
                if (record.status === 'approved') color = 'green';
                if (record.status === 'rejected') color = 'red';
                return (
                    <Tag color={color} style={{ textTransform: 'capitalize', padding: '4px 8px' }}>
                        {record.status}
                    </Tag>
                );
            },
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space>
                    {record.status === 'pending' && (
                        <>
                            <Button 
                                type="primary" 
                                size="small"
                                style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                                onClick={() => handleStatus(record, 'approved')}
                            >
                                Approve
                            </Button>
                            <Button 
                                danger 
                                size="small"
                                onClick={() => handleStatus(record, 'rejected')}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {record.status === 'approved' && (
                        <Button 
                            danger 
                            size="small"
                            onClick={() => handleStatus(record, 'rejected')}
                        >
                            Reject
                        </Button>
                    )}
                    {record.status === 'rejected' && (
                        <Button 
                            type="primary" 
                            size="small"
                            style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                            onClick={() => handleStatus(record, 'approved')}
                        >
                            Approve
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
                    <i className="fa-solid fa-user-doctor" style={{ marginRight: '10px', color: '#0284c7' }}></i>
                    Patient Appointments Management
                </h2>
                <Table 
                    columns={columns} 
                    dataSource={appointments} 
                    rowKey="_id" 
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>
        </Layout>
    );
};

export default DoctorAppointments;
