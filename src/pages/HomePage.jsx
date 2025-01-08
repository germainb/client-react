import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThreads, setLoading, setError } from "../redux/threadSlice";
import Thread from "../components/Thread";
import { Spin, Alert } from "antd";
import { getThreads } from "../services/authService";
import styled from "styled-components";

const ThreadsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

// Wrapper to center content in the middle of the screen
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;  // Take full screen height
  background-color: rgba(0, 0, 0, 0.1);  // Optional: Semi-transparent background
`;

const SpinWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;  // Adjust to fit the spinner size
  height: 60px; // Adjust to fit the spinner size
`;

const HomePage = () => {
  const dispatch = useDispatch();
  const { threads, loading, error } = useSelector((state) => state.threads);

  useEffect(() => {
    const fetchThreads = async () => {
      dispatch(setError(null));
      dispatch(setLoading(true));
      try {
        const response = await getThreads();
        dispatch(setThreads(response));
      } catch (error) {
        dispatch(setError("Error fetching threads"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchThreads();
  }, [dispatch]);

  if (loading) {
    return (
        <SpinWrapper>
          <Spin />
        </SpinWrapper>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        style={{ marginTop: "20px" }}
      />
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Tous les messages</h1>
      {threads.length === 0 ? (
        <p style={{ textAlign: "center" }}>Pas de messages disponibles.</p>
      ) : (
        <ThreadsWrapper>
          {threads.map((thread) => (
            <Thread
              key={thread._id}
              thread={thread}
            />
          ))}
        </ThreadsWrapper>
      )}
    </div>
  );
};

export default HomePage;
