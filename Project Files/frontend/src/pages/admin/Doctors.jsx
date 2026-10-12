import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout.jsx";
import axios from "axios";
import { Table, message, Tag, Button, Space, Card } from "antd";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // getDoctors
  const getDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLoading(false);
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to fetch doctors list");
    }
  };
  
  // handle account status
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong updating doctor status");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "name",
      render: (text, record) => (
        <span style={{ fontWeight: 600 }}>
          Dr. {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => <Tag color="blue">{record.specialization}</Tag>,
    },
    {
      title: "Experience",
      dataIndex: "experience",
      render: (text, record) => <span>{record.experience} Yrs</span>,
    },
    {
      title: "Fees (₹)",
      dataIndex: "feesPerConsultation",
      render: (text, record) => <span>₹{record.feesPerConsultation}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
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
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <Space>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: "#059669", borderColor: "#059669" }}
                onClick={() => handleAccountStatus(record, "approved")}
              >
                Approve
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleAccountStatus(record, "rejected")}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === "approved" && (
            <Button
              danger
              size="small"
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Revoke / Reject
            </Button>
          )}
          {record.status === "rejected" && (
            <Button
              type="primary"
              size="small"
              style={{ backgroundColor: "#059669", borderColor: "#059669" }}
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Re-approve
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Card bordered={false} style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>
          <i className="fa-solid fa-user-doctor" style={{ marginRight: "10px", color: "#0284c7" }}></i>
          All Registered Doctors
        </h2>
        <Table columns={columns} dataSource={doctors} rowKey="_id" loading={loading} pagination={{ pageSize: 8 }} />
      </Card>
    </Layout>
  );
};

export default Doctors;