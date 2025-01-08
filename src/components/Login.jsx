// src/components/Login.js
import React from "react";
import { Button, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../redux/userSlice";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { login } from "../services/authService";

const LoginContainer = styled.div`
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

const LoginTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    dispatch(setError(null));
    dispatch(setLoading(true));
    try {

      const response = await login(values);

      dispatch(
        setUser({
          user: {
            _id: response._id,
            email: response.email,
            name: response.name,
            avatar: response.avatar,
            img: response.img
          },
          token: response.token,
        })
      );
      message.success("Connexion réussie!");
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Impossible de se connecter!";
      dispatch(setError(errorMessage));
      message.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <FormWrapper>
        <LoginTitle>
          <h2>Connexion</h2>
        </LoginTitle>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {errors.general && <ErrorText>{errors.general}</ErrorText>}

              <div>
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
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading || isSubmitting}
                >
                  Se connecter
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </LoginContainer>
  );
};

export default Login;
