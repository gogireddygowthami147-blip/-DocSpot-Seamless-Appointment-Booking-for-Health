import React from 'react';
import { AdminMenu, UserMenu, DoctorMenu } from '../Data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, message, Tag } from 'antd';
import { clearUser } from '../redux/features/userSlice';
import '../styles/LayoutStyles.css';

const Layout = ({ children }) => {
    const { user } = useSelector(state => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
        localStorage.clear();
        message.success('Logged Out Successfully');
        navigate('/login');
    };

    // Role-based sidebar menu
    const SidebarMenu = user?.isAdmin ? AdminMenu : user?.isDoctor ? DoctorMenu : UserMenu;
    const logoTitle = user?.isAdmin ? 'DocSpot Admin' : user?.isDoctor ? 'DocSpot Doctor' : 'DocSpot';
    const roleTag = user?.isAdmin ? 'Admin' : user?.isDoctor ? 'Doctor' : 'Patient';

    return (
        <div className="main">
            <div className="sidebar">
                <div className="logo">
                    <h6><i className="fa-solid fa-hospital-user" style={{ marginRight: '8px' }}></i>{logoTitle}</h6>
                </div>
                <div className="menu">
                    {SidebarMenu.map(menu => {
                        const isActive = location.pathname === menu.path;
                        return (
                            <div key={menu.name} className={`menu-item ${isActive ? 'active' : ''}`} onClick={() => navigate(menu.path)}>
                                <i className={menu.icon}></i>
                                <Link to={menu.path}>{menu.name}</Link>
                            </div>
                        );
                    })}
                    <div className="menu-item logout-item" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="header">
                    <div className="header-content">
                        <Tag color={user?.isAdmin ? 'magenta' : user?.isDoctor ? 'blue' : 'green'} style={{ marginRight: '15px', fontWeight: 600 }}>
                            {roleTag}
                        </Tag>
                        <Badge 
                            count={user?.notification?.length || 0} 
                            onClick={() => navigate('/notification')}
                            style={{ cursor: 'pointer' }}
                            title="Notifications"
                        >
                            <i className="fa-solid fa-bell"></i>
                        </Badge>
                        <Link to="/profile" style={{ marginLeft: '10px' }}>
                            <i className="fa-solid fa-circle-user" style={{ marginRight: '6px' }}></i>
                            {user?.name || 'My Profile'}
                        </Link>
                    </div>
                </div>
                <div className="body">{children}</div>
            </div>
        </div>
    );
};

export default Layout;