import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import axios from 'axios';
import { Table, Tag, message, Card } from 'antd';
import moment from 'moment';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAppointments = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/user/user-appointments', {
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
            message.error('Failed to load appointments');
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const columns = [
        {
            title: 'Doctor Name',
            dataIndex: 'doctorInfo',
            render: (text, record) => {
                if (typeof record.doctorInfo === 'object' && record.doctorInfo !== null) {
                    return (
                        <span style={{ fontWeight: 600 }}>
                            Dr. {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                        </span>
                    );
                }
                return <span>{record.doctorInfo || 'N/A'}</span>;
            },
        },
        {
            title: 'Specialization',
            dataIndex: 'specialization',
            render: (text, record) => {
                if (typeof record.doctorInfo === 'object' && record.doctorInfo !== null) {
                    return <Tag color="blue">{record.doctorInfo.specialization}</Tag>;
                }
                return <Tag color="blue">Consultation</Tag>;
            },
        },
        {
            title: 'Contact Phone',
            dataIndex: 'phone',
            render: (text, record) => {
                if (typeof record.doctorInfo === 'object' && record.doctorInfo !== null) {
                    return <span>{record.doctorInfo.phone}</span>;
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
                let icon = 'fa-solid fa-clock';
                if (record.status === 'approved') {
                    color = 'green';
                    icon = 'fa-solid fa-circle-check';
                } else if (record.status === 'rejected') {
                    color = 'red';
                    icon = 'fa-solid fa-circle-xmark';
                }
                return (
                    <Tag color={color} style={{ textTransform: 'capitalize', padding: '4px 8px', fontSize: '0.85rem' }}>
                        <i className={icon} style={{ marginRight: '5px' }}></i>
                        {record.status}
                    </Tag>
                );
            },
        },
        {
            title: 'Booked On',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {moment(record.createdAt).format('DD MMM YYYY, hh:mm A')}
                </span>
            ),
        },
    ];

    return (
        <Layout>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#1e293b' }}>
                        <i className="fa-solid fa-calendar-check" style={{ marginRight: '10px', color: '#0284c7' }}></i>
                        My Booked Appointments
                    </h2>
                </div>
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

export default Appointments;