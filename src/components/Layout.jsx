import React from "react";
import { Buffer } from "buffer";
import { Layout, Avatar, Dropdown, Menu } from "antd";
import { LoginOutlined, UserAddOutlined, LogoutOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";

import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ReactLogo } from "../assets/thread-logo1.svg"; // Replace with your actual logo

const { Header, Content } = Layout;

// Styled Components
const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #001529;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;

  svg {
    height: 40px;
    width: 40px;
    fill: #61dafb;
  }
`;

const StyledMenuIcon = styled(MenuOutlined)`
  font-size: 24px;
  color: #61dafb;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

const LayoutComponent = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(0);
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToCreateThread = () => {
    navigate("/create-thread");
  };


  // Dropdown menu items for authenticated and unauthenticated users
  const menuItems = (
    <Menu>
      {!user ? (
        <>
          <Menu.Item key="login" icon={<LoginOutlined />} onClick={handleLogin}>
            Connexion
          </Menu.Item>
          <Menu.Item key="register" icon={<UserAddOutlined />} onClick={handleRegister}>
            Inscription
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="profile" icon={ <Avatar src={`data: ${user.img.contentType};base64, ${Buffer.from(user.img.data).toString('base64')}`} alt={user.name} size={48} />} >
            {user.name}
          </Menu.Item>

          <Menu.Item key="create" icon={<PlusOutlined />} onClick={goToCreateThread}>
            Ajouter un message
          </Menu.Item>

          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Se déconnecter
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <Layout>
      <StyledHeader>
        <LogoContainer onClick={goToHome}>
          <ReactLogo />
          Messagerie
        </LogoContainer>
        <Dropdown overlay={menuItems}  placement="bottomRight">
          <StyledMenuIcon />
        </Dropdown>
      </StyledHeader>
      <Content style={{ minHeight: "90vh", padding: "20px" }}>{children}</Content>
    </Layout>
  );
};

export default LayoutComponent;
