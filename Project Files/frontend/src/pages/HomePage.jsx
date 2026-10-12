import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout.jsx';
import { Row, Col, Input, Select, Empty, Card, Tag } from 'antd';
import DoctorCard from '../components/DoctorCard.jsx';

const { Search } = Input;
const { Option } = Select;

const HomePage = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');

    const getAllDoctors = async () => {
        try {
            const res = await axios.get('/api/v1/user/getAllDoctors', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                }
            });
            if (res.data.success) {
                setDoctors(res.data.data);
                setFilteredDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Filter logic
    useEffect(() => {
        let result = doctors;
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            result = result.filter(d => 
                `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
                d.specialization.toLowerCase().includes(q) ||
                (d.address && d.address.toLowerCase().includes(q))
            );
        }
        if (selectedSpecialty !== 'all') {
            result = result.filter(d => d.specialization.toLowerCase() === selectedSpecialty.toLowerCase());
        }
        setFilteredDoctors(result);
    }, [searchQuery, selectedSpecialty, doctors]);

    useEffect(() => {
        getAllDoctors();
    }, []);

    // Unique specialties
    const specialties = Array.from(new Set(doctors.map(d => d.specialization))).filter(Boolean);

    return (
        <Layout>
            {/* Hero / Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: 'white',
                padding: '24px 30px',
                borderRadius: '12px',
                marginBottom: '24px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <h2 style={{ color: 'white', margin: '0 0 6px 0', fontSize: '1.6rem' }}>
                        Book Expert Doctors Seamlessly
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                        Select verified healthcare specialists, choose your preferred slot, and get instant confirmation.
                    </p>
                </div>
                <div>
                    <Tag color="cyan" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
                        <i className="fa-solid fa-stethoscope" style={{ marginRight: '6px' }}></i>
                        {doctors.length} Verified Doctors
                    </Tag>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <Card bordered={false} style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={14}>
                        <Search
                            placeholder="Search doctors by name, specialty, or clinic location..."
                            allowClear
                            enterButton="Search"
                            size="large"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} md={10}>
                        <Select
                            defaultValue="all"
                            size="large"
                            style={{ width: '100%' }}
                            onChange={(value) => setSelectedSpecialty(value)}
                        >
                            <Option value="all">All Specialties</Option>
                            {specialties.map(s => (
                                <Option key={s} value={s}>{s}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Doctor Cards Grid */}
            {filteredDoctors && filteredDoctors.length > 0 ? (
                <Row gutter={[20, 20]}>
                    {filteredDoctors.map(doctor => (
                        <Col xs={24} sm={12} lg={8} key={doctor._id}>
                            <DoctorCard doctor={doctor} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Card bordered={false} style={{ textAlign: 'center', padding: '40px 0', borderRadius: '12px' }}>
                    <Empty description="No doctors found matching your criteria" />
                </Card>
            )}
        </Layout>
    );
};

export default HomePage;