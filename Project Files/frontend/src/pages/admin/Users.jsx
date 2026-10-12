import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout.jsx";
import axios from "axios";
import { Table, message, Tag, Button, Popconfirm, Card } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // getUsers
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLoading(false);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to fetch users");
    }
  };

  // delete/block user
  const handleDeleteUser = async (userId) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/deleteUser",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getUsers();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error while removing user");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => {
        if (record.isAdmin) return <Tag color="magenta">Admin</Tag>;
        if (record.isDoctor) return <Tag color="blue">Doctor</Tag>;
        return <Tag color="green">Patient</Tag>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div>
          {!record.isAdmin ? (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to remove this user?"
              onConfirm={() => handleDeleteUser(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small">
                Remove
              </Button>
            </Popconfirm>
          ) : (
            <Tag color="default">Protected Admin</Tag>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Card bordered={false} style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>
          <i className="fa-solid fa-users" style={{ marginRight: "10px", color: "#0284c7" }}></i>
          All Registered Users
        </h2>
        <Table columns={columns} dataSource={users} rowKey="_id" loading={loading} pagination={{ pageSize: 8 }} />
      </Card>
    </Layout>
  );
};

export default Users;