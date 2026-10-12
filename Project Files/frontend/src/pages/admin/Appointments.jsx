import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout.jsx";
import { Table, message, Tag, Card } from "antd";
import moment from "moment";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAppointments = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/v1/admin/getAllAppointments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setLoading(false);
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error("Something went wrong fetching appointments");
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const columns = [
        {
            title: "Appointment ID",
            dataIndex: "_id",
            render: (text) => <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{text}</span>,
        },
        {
            title: "Doctor Name",
            dataIndex: "doctorInfo",
            render: (text, record) => {
                if (typeof record.doctorInfo === 'object' && record.doctorInfo !== null) {
                    return (
                        <span style={{ fontWeight: 600 }}>
                            Dr. {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                        </span>
                    );
                }
                return <span>{record.doctorInfo || "N/A"}</span>;
            },
        },
        {
            title: "Patient Name",
            dataIndex: "userInfo",
            render: (text, record) => {
                if (typeof record.userInfo === 'object' && record.userInfo !== null) {
                    return <span>{record.userInfo.name}</span>;
                }
                return <span>{record.userInfo || "N/A"}</span>;
            },
        },
        {
            title: "Date & Time",
            dataIndex: "date",
            render: (text, record) => (
                <span>
                    <i className="fa-regular fa-calendar" style={{ marginRight: "5px", color: "#64748b" }}></i>
                    {record.date}  
                    <i className="fa-regular fa-clock" style={{ marginRight: "5px", marginLeft: "8px", color: "#64748b" }}></i>
                    {record.time}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text, record) => {
                let color = "gold";
                if (record.status === "approved") color = "green";
                if (record.status === "rejected") color = "red";
                return (
                    <Tag color={color} style={{ textTransform: "capitalize", padding: "4px 8px" }}>
                        {record.status}
                    </Tag>
                );
            },
        },
        {
            title: "Booked On",
            dataIndex: "createdAt",
            render: (text, record) => (
                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    {moment(record.createdAt).format("DD MMM YYYY, hh:mm A")}
                </span>
            ),
        },
    ];

    return (
        <Layout>
            <Card bordered={false} style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>
                    <i className="fa-solid fa-calendar-check" style={{ marginRight: "10px", color: "#0284c7" }}></i>
                    All Platform Appointments
                </h2>
                <Table columns={columns} dataSource={appointments} rowKey="_id" loading={loading} pagination={{ pageSize: 8 }} />
            </Card>
        </Layout>
    );
};

export default Appointments;