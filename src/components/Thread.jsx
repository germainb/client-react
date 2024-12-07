import React from "react";
import { Avatar, Button, message } from "antd";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateThread } from "../redux/threadSlice";
import { dislikeThread, likeThread } from "../services/authService";

const ThreadWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ThreadHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const ThreadTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ThreadContent = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 12px 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  color: ${(props) => (props.like ? "green" : props.dislike ? "red" : "#000")};  // Conditionally set color
  &:hover {
    color: ${(props) => (props.like ? "darkgreen" : props.dislike ? "darkred" : "#000")};
  }
`;

const Count = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.like ? "green" : props.dislike ? "red" : "#555")};
`;

const Thread = ({ thread }) => {
  const { user } = useSelector((state) => state.user);
  const { _id, title, content, author, likes, dislikes } = thread;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLike = async () => {
    if(!user) navigate("/login");
    try {
      const updatedThread = await likeThread(_id); // Call the like API
      dispatch(updateThread(updatedThread.thread)); // Dispatch to update Redux state
    } catch (error) {
      message.error(error.message); 
      console.error("Error liking the thread:", error.message);
    }
  };
  
  const handleDislike = async () => {
    if(!user) navigate("/login");
    try {
      const updatedThread = await dislikeThread(_id); // Call the dislike API
      dispatch(updateThread(updatedThread.thread)); // Dispatch to update Redux state
    } catch (error) {
      message.error(error.message);
      console.error("Error disliking the thread:", error.message);
    }
  };

  return (
    <ThreadWrapper>
      <ThreadHeader>
        <Avatar src={author.avatar} alt={author.name} size={48} />
        <div style={{ marginLeft: 12 }}>
          <ThreadTitle>{title}</ThreadTitle>
          <span>By {author.name}</span>
        </div>
      </ThreadHeader>

      <ThreadContent>{content}</ThreadContent>

      <Actions>
        <ActionButton onClick={handleLike} like icon={<AiFillLike size={20} />}>
          <Count like>{likes.length} Likes</Count>
        </ActionButton>
        <ActionButton onClick={handleDislike} dislike  icon={<AiFillDislike size={20} />}>
          <Count dislike >{dislikes.length} Dislikes</Count>
        </ActionButton>
      </Actions>
    </ThreadWrapper>
  );
};

export default Thread;
