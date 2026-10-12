import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DatePicker, TimePicker, message, Card, Row, Col, Tag, Button, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import moment from 'moment';

const BookingPage = () => {
    const { user } = useSelector(state => state.user);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);

    // Fetch doctor details
    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/user/getDoctorById',
                { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                setDoctor(res.data.data);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Failed to fetch doctor details');
        }
    };

    // Check availability
    const handleAvailability = async () => {
        if (!date || !time) {
            return message.warning('Please select both Date and Time first');
        }
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/user/check-booking-availbility',
                { doctorId: params.doctorId, date, time },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                if (res.data.isAvailable) {
                    setIsAvailable(true);
                    message.success(res.data.message);
                } else {
                    setIsAvailable(false);
                    message.error(res.data.message);
                }
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Error checking availability');
        }
    };

    // Book appointment
    const handleBooking = async () => {
        if (!date || !time) {
            return message.warning('Please select Date and Time');
        }
        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/user/book-appointment',
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctor,
                    userInfo: user,
                    date,
                    time,
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
                navigate('/appointments');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Error while booking appointment');
        }
    };

    useEffect(() => {
        getDoctorData();
    }, [params.doctorId]);

    return (
        <Layout>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '10px' }}>
                <h2 style={{ marginBottom: '20px', color: '#1a365d' }}>
                    <i className="fa-solid fa-calendar-plus" style={{ marginRight: '10px', color: '#0284c7' }}></i>
                    Book an Appointment
                </h2>

                {doctor && (
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Card 
                                title={
                                    <span style={{ fontSize: '1.2rem', color: '#0f172a' }}>
                                        Dr. {doctor.firstName} {doctor.lastName}
                                    </span>
                                }
                                extra={<Tag color="blue">{doctor.specialization}</Tag>}
                                bordered={false}
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderRadius: '12px' }}
                            >
                                <p style={{ margin: '8px 0' }}>
                                    <strong><i className="fa-solid fa-briefcase-medical" style={{ marginRight: '8px', color: '#64748b' }}></i>Experience:</strong> {doctor.experience} Years
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong><i className="fa-solid fa-indian-rupee-sign" style={{ marginRight: '8px', color: '#64748b' }}></i>Consultation Fee:</strong> ₹{doctor.feesPerConsultation}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong><i className="fa-solid fa-clock" style={{ marginRight: '8px', color: '#64748b' }}></i>Timings:</strong> {Array.isArray(doctor.timings) ? `${doctor.timings[0]} - ${doctor.timings[1]}` : 'Flexible'}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong><i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: '#64748b' }}></i>Address:</strong> {doctor.address}
                                </p>
                                <p style={{ margin: '8px 0' }}>
                                    <strong><i className="fa-solid fa-phone" style={{ marginRight: '8px', color: '#64748b' }}></i>Phone:</strong> {doctor.phone}
                                </p>
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card 
                                title={<span style={{ fontSize: '1.1rem' }}>Select Date & Time Slot</span>}
                                bordered={false}
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderRadius: '12px' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>
                                            Select Date:
                                        </label>
                                        <DatePicker 
                                            format="DD-MM-YYYY"
                                            style={{ width: '100%' }}
                                            onChange={(value, dateString) => {
                                                setDate(dateString);
                                                setIsAvailable(false);
                                            }}
                                            disabledDate={(current) => current && current < moment().startOf('day')}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>
                                            Select Time:
                                        </label>
                                        <TimePicker 
                                            format="HH:mm"
                                            style={{ width: '100%' }}
                                            onChange={(value, timeString) => {
                                                setTime(timeString);
                                                setIsAvailable(false);
                                            }}
                                        />
                                    </div>

                                    <Divider style={{ margin: '12px 0' }} />

                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <Button 
                                            type="default" 
                                            onClick={handleAvailability}
                                            style={{ flex: 1, borderColor: '#0284c7', color: '#0284c7', fontWeight: 600 }}
                                        >
                                            Check Availability
                                        </Button>

                                        <Button 
                                            type="primary" 
                                            onClick={handleBooking}
                                            disabled={!date || !time}
                                            style={{ flex: 1, backgroundColor: '#059669', borderColor: '#059669', fontWeight: 600 }}
                                        >
                                            Book Appointment
                                        </Button>
                                    </div>

                                    {isAvailable && (
                                        <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.9rem' }}>
                                            <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i>
                                            Selected slot is available! Click "Book Appointment" to confirm.
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;
