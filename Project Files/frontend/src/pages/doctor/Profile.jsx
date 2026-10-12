import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { Col, Form, Input, Row, TimePicker, message, Button, Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';

const DoctorProfile = () => {
    const { user } = useSelector(state => state.user);
    const [doctor, setDoctor] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get doctor info
    const getDoctorInfo = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/doctor/getDoctorInfo',
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    // Update profile
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/doctor/updateProfile',
                {
                    ...values,
                    userId: user._id,
                    timings: [
                        moment(values.timings[0]).format("HH:mm"),
                        moment(values.timings[1]).format("HH:mm"),
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/dashboard');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Error updating doctor profile');
        }
    };

    useEffect(() => {
        if (user) {
            getDoctorInfo();
        }
    }, [user]);

    return (
        <Layout>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '10px' }}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>
                    <i className="fa-solid fa-user-doctor" style={{ marginRight: '10px', color: '#0284c7' }}></i>
                    Doctor Profile & Clinic Settings
                </h2>
                {doctor ? (
                    <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <Form 
                            layout="vertical" 
                            onFinish={handleFinish}
                            initialValues={{
                                ...doctor,
                                timings: [
                                    moment(doctor?.timings?.[0] || "09:00", "HH:mm"),
                                    moment(doctor?.timings?.[1] || "17:00", "HH:mm"),
                                ],
                            }}
                        >
                            <h4 style={{ marginBottom: '1rem', color: '#0284c7' }}>Personal Details:</h4>
                            <Row gutter={20}>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="First Name" name="firstName" required rules={[{ required: true }]}>
                                        <Input type="text" placeholder="First name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Last Name" name="lastName" required rules={[{ required: true }]}>
                                        <Input type="text" placeholder="Last name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Phone" name="phone" required rules={[{ required: true }]}>
                                        <Input type="text" placeholder="Phone number" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Email" name="email" required rules={[{ required: true }]}>
                                        <Input type="email" placeholder="Email address" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={16}>
                                    <Form.Item label="Clinic Address" name="address" required rules={[{ required: true }]}>
                                        <Input type="text" placeholder="Clinic address" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#0284c7' }}>Professional Details:</h4>
                            <Row gutter={20}>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Specialization" name="specialization" required rules={[{ required: true }]}>
                                        <Input type="text" placeholder="Specialization" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Experience (in Years)" name="experience" required rules={[{ required: true }]}>
                                        <Input type="text" placeholder="Experience" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Fees Per Consultation (₹)" name="feesPerConsultation" required rules={[{ required: true }]}>
                                        <Input type="number" placeholder="Consultation fees" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Timings" name="timings" required rules={[{ required: true }]}>
                                        <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#0284c7', padding: '0 24px' }}>
                                    Update Profile
                                </Button>
                            </div>
                        </Form>
                    </Card>
                ) : (
                    <Card>
                        <p>No active doctor profile found for this account. If you applied recently, please wait for admin approval.</p>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default DoctorProfile;
