import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Button } from 'antd';
import '../styles/DoctorCard.css';

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();

    const timingsText = Array.isArray(doctor.timings) && doctor.timings.length >= 2
        ? `${doctor.timings[0]} - ${doctor.timings[1]}`
        : 'Consultation Hours';

    return (
        <div 
            className="doctor-card"
            onClick={() => navigate(`/book-appointment/${doctor._id}`)} 
        >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Dr. {doctor.firstName} {doctor.lastName}</span>
                <Tag color="cyan">{doctor.specialization}</Tag>
            </div>
            <div className="card-body">
                <p><b><i className="fa-solid fa-briefcase-medical" style={{ marginRight: '6px', color: '#0284c7' }}></i>Experience:</b> {doctor.experience} Yrs</p>
                <p><b><i className="fa-solid fa-indian-rupee-sign" style={{ marginRight: '6px', color: '#059669' }}></i>Fees:</b> ₹{doctor.feesPerConsultation}</p>
                <p><b><i className="fa-solid fa-clock" style={{ marginRight: '6px', color: '#d97706' }}></i>Timings:</b> {timingsText}</p>
                <p><b><i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: '#64748b' }}></i>Address:</b> {doctor.address}</p>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" size="small" style={{ backgroundColor: '#0284c7' }}>
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;