import React from "react";
import { Button, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { createThread } from "../services/authService";
import { setError, setLoading } from "../redux/threadSlice";

const CreateThreadContainer = styled.div`
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

const CreateThreadTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CreateThread = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.threads);

  const threadSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(5, "Title must be at least 5 characters long"),
    content: Yup.string()
      .required("Content is required")
      .min(10, "Content must be at least 10 characters long"),
  });

  const handleCreateThread = async (values, { setSubmitting, setErrors }) => {
    dispatch(setError(null));
    dispatch(setLoading(true));
    try {
      await createThread(values);
      message.success("Thread created successfully!");
      navigate("/"); // Redirect to homepage
    } catch (err) {
      const errorMessage = err || "Failed to create thread!";
      dispatch(setError(errorMessage));
      message.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  return (
    <CreateThreadContainer>
      <FormWrapper>
        <CreateThreadTitle>
          <h2>Create Thread</h2>
        </CreateThreadTitle>
        <Formik
          initialValues={{ title: "", content: "" }}
          validationSchema={threadSchema}
          onSubmit={handleCreateThread}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {errors.general && <ErrorText>{errors.general}</ErrorText>}

              <div>
                <label htmlFor="title">Title</label>
                <Field
                  as={Input}
                  name="title"
                  size="large"
                  placeholder="Enter thread title"
                />
                {touched.title && errors.title && (
                  <ErrorText>{errors.title}</ErrorText>
                )}
              </div>

              <div style={{ marginTop: "16px" }}>
                <label htmlFor="content">Content</label>
                <Field
                  as={Input.TextArea}
                  name="content"
                  rows={4}
                  placeholder="Enter thread content"
                />
                {touched.content && errors.content && (
                  <ErrorText>{errors.content}</ErrorText>
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
                  Create Thread
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </CreateThreadContainer>
  );
};

export default CreateThread;
