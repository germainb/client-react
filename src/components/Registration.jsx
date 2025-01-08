import React, { useState } from "react";
import { Button, Input, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../redux/userSlice";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { register } from "../services/authService";

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f0f2f5;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorText = styled.div`
  color: red;
  margin-bottom: 8px;
`;

const RegisterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadProfile = styled(Upload)`
  .ant-upload {
    width: 70px !important;
    height: 70px !important;
  }
`;

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const registerSchema = Yup.object().shape({
    name: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;

    if (file) {
      // Set the avatar file
      setAvatarFile(file);
      // Generate preview URL
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (avatarFile) formData.append("avatar", avatarFile);

    dispatch(setError(null));
    dispatch(setLoading(true));
    try {
      const response = await register(formData);
      dispatch(setUser({ user: response.user, token: response.token }));
      message.success("Registration successful!");
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to register!" + err;
      dispatch(setError(errorMessage));
      message.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  return (
    <RegisterContainer>
      <FormWrapper>
        <RegisterTitle>
          <h2>Sign Up</h2>
        </RegisterTitle>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {errors.general && <ErrorText>{errors.general}</ErrorText>}

              <div>
                <label htmlFor="name">Nom d'usager</label>
                <Field
                  as={Input}
                  name="name"
                  size="large"
                  placeholder="Enter your username"
                />
                {touched.username && errors.username && (
                  <ErrorText>{errors.name}</ErrorText>
                )}
              </div>

              <div style={{ marginTop: "16px" }}>
                <label htmlFor="email">Courriel</label>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  size="large"
                  placeholder="Enter your email"
                />
                {touched.email && errors.email && (
                  <ErrorText>{errors.email}</ErrorText>
                )}
              </div>

              <div style={{ marginTop: "16px" }}>
                <label htmlFor="password">Mot de passe</label>
                <Field
                  as={Input.Password}
                  name="password"
                  size="large"
                  placeholder="Enter your password"
                />
                {touched.password && errors.password && (
                  <ErrorText>{errors.password}</ErrorText>
                )}
              </div>

              <div style={{ marginTop: "16px" }}>
                <label>Avatar</label>
                <UploadProfile
                  name="avatar"
                  listType="picture-circle"
                  showUploadList={false}
                  beforeUpload={() => true}
                  onChange={handleAvatarChange}
                  style={{}}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Envoyer</div>
                    </div>
                  )}
                </UploadProfile>
              </div>

              <div style={{ marginTop: "16px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isSubmitting}
                >
                  S'inscrire
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </RegisterContainer>
  );
};

export default Registration;
