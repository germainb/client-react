import React from "react";
import { Buffer } from "buffer";
import { useState,useEffect } from 'react';
import { Avatar, Button, message, Modal } from "antd";
import { AiFillLike, AiFillDislike, AiFillDelete } from "react-icons/ai";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeThread, updateThread } from "../redux/threadSlice";
import { deleteThread, dislikeThread, getUser, likeThread } from "../services/authService";



const ThreadWrapper = styled.div`
  position: relative; /* Ensures the delete icon can be positioned absolutely */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  justify-content: space-between;
  margin-top: auto; /* Ensures buttons are at the bottom */
  width: 100%;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  color: ${(props) => (props.like ? "green" : props.dislike ? "red" : "#000")};
  flex-grow: 1; /* Ensure buttons grow equally */
  &:hover {
    color: ${(props) => (props.like ? "darkgreen" : props.dislike ? "darkred" : "#000")};
  }
`;

const Count = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.like ? "green" : props.dislike ? "red" : "#555")};
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: red;
  &:hover {
    color: darkred;
  }
`;


const Thread = ({ thread }) => {
  const { user } = useSelector((state) => state.user);
  const { _id, title, content, author, likes, dislikes } = thread;
  const [authorUser,setAuthorUser] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const getAuthorUser = async () => {
      try {
        const response = await getUser(author._id);
        dispatch(setAuthorUser(response));
      } catch (error) {
        
      }
      }
      getAuthorUser();
  }, [author,dispatch]);

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

  const handleDelete = async () => {
    // Show confirmation dialog using Ant Design's Modal.confirm
    Modal.confirm({
      title: "Êtes vous sûr de vouloir supprimer ce message?",
      content: "Cette action est irréversible.",
      onOk: async () => {
        try {
          // Perform the delete thread API call using the deleteThread function from authService
          await deleteThread(_id);
          // Show success message
          message.success("Thread deleted successfully!");
          // Dispatch to remove the thread from Redux state
          dispatch(removeThread(_id));
          navigate("/"); // Navigates to the home page
        } catch (error) {
          // Handle errors by showing an error message
          message.error(error.message);
          console.error("Error deleting the thread:", error.message);
        }
      },
      onCancel() {
        console.log("Thread deletion cancelled");
      },
    });
  };
  
  return (
    <ThreadWrapper>
      {user && user._id === author._id && (
        <DeleteButton onClick={handleDelete}>
          <AiFillDelete size={20} />
        </DeleteButton>
      )}
      <ThreadHeader>
  
 {authorUser.img  && (
        <Avatar src={`data: ${authorUser.img.contentType};base64, ${Buffer.from(authorUser.img.data).toString('base64')}`} alt={author.name} size={48} />
 )}    
        <div style={{ marginLeft: 12 }}>
          <ThreadTitle>{title}</ThreadTitle>
          <span>Par {author.name}</span>
        </div>
      </ThreadHeader>

      <ThreadContent>{content}</ThreadContent>

      <Actions>
        <ActionButton onClick={handleLike} like icon={<AiFillLike size={20} />}>
          <Count like>{likes.length} J'aime</Count>
        </ActionButton>
        <ActionButton onClick={handleDislike} dislike  icon={<AiFillDislike size={20} />}>
          <Count dislike >{dislikes.length} J'aime pas</Count>
        </ActionButton>
      </Actions>
    </ThreadWrapper>
  );
};

export default Thread;
