import React, { useState } from "react";
import { Buffer } from "buffer";
import { Layout, Avatar, Dropdown, Menu,Upload } from "antd";
import { LoginOutlined, UserAddOutlined, LogoutOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser, updateUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import mainLogo from "../assets/bouc.png"; // Replace with your actual logo
import { Formik, Form, Field } from "formik";
import { login, loginFacebook, updateAvatar } from "../services/authService";
import FacebookLogin from 'react-facebook-login';

const { Header, Content } = Layout;

// Styled Components
const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color:rgb(24, 119, 242);
`;

const UploadProfile = styled(Upload)`
  .ant-upload {
    width: 70px !important;
    height: 70px !important;
  }
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
  const [avatarFile, setAvatarFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
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

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    console.log("Info:"+info.file.name);
    if (file) {
      // Set the avatar file
      setAvatarFile(file);
      handleUploadAvatar();
    }
  };

   const handleUploadAvatar = async () => {
    const formData = new FormData();
    
    formData.append("avatar", avatarFile);

    try {
      const response = await updateAvatar(user,formData);
       dispatch(
              setUser({
                user: {
                  _id: response._id,
                  email: response.email,
                  name: response.name,
                  avatar: response.avatar,
                  img: response.img
                }
              })
            );
      navigate("/");
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update avatar!" + err;
      console.log (errorMessage);
    } finally {
     
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleFacebookCallback = (response) => {
    if (response?.status === "unknown") {
        console.error('Sorry!', 'Something went wrong with facebook Login.');
     return;
    }
    console.log("handleFacebookCallback:"+response);
    setAvatarFile(response.picture.data.url);
    const formData = new FormData();
    
    formData.append("email", response.email);
    formData.append("name", response.name);
    formData.append("picture", response.picture.data.url);
    response = loginFacebook(formData);
    console.log(response);

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
          <Menu.Item key="FacebookLogin" icon={<LoginOutlined />} >
          <FacebookLogin 
            buttonStyle={{padding:"6px"}}  
            appId="1582303069097930"  // we need to get this from facebook developer console by setting the app.
            autoLoad={false}  
            fields="name,email,picture"  
            callback={handleFacebookCallback}/>
          </Menu.Item>
          
        </>
      ) : (
        <>
          <Formik>
            <Form>
              <UploadProfile 
                  name="avatar"
                  listType="picture-circle"
                  showUploadList={false}
                  beforeUpload={() => true }
                  onChange={handleAvatarChange}
                  action={`https://serveur-react.vercel.app/api/auth/updateAvatar/${user._id}`}
                  style={{}}
                >
                <Menu.Item key="profile" icon={ <Avatar style={{marginLeft:"7px"}} src={`data: ${user.img.contentType};base64, ${Buffer.from(user.img.data).toString('base64')}`} alt={user.name} size={66}  />} />  
                </UploadProfile>
              </Form>
          </Formik>
         {user.name}
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
        <img  src={mainLogo} alt="Face de bouc" width="70" height="70"/>
          Face de bouc
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
