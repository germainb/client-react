import React from "react";
import { Buffer } from "buffer";
import { useState,useEffect } from 'react';
import { Avatar, Button, Input, message, Modal } from "antd";
import { AiFillLike, AiFillDislike, AiFillDelete } from "react-icons/ai";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeThread, updateThread } from "../redux/threadSlice";
import { deleteThread, dislikeThread, likeThread, addComment, getComments, sendEmail } from "../services/authService";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";


const ThreadWrapper = styled.div`
  position: relative; /* Ensures the delete icon can be positioned absolutely */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 360px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ThreadHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
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
  top: 0px;
  right: 0px;
  background: transparent;
  border: none;
  color: red;
  &:hover {
    color: darkred;
  }
`;

const ErrorText = styled.div`
  color: red;
  margin-bottom: 8px;
`;

const Commentaires = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: auto; /* Ensures buttons are at the bottom */
  width: 100%;
`;

const Commentaire = styled.div`
  display: flex;
  align-items: left;
  justify-content: space-between;
  margin-top: auto; /* Ensures buttons are at the bottom */
  width: 100%;
`;

const Thread = ({ thread }) => {
  const { user } = useSelector((state) => state.user);
  const { _id, title, content, author, likes, dislikes, createdAt } = thread;
  const [comments,setComments] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const getCommentaires = async () => {
      var response="";
      try {
        response = await getComments(_id);
        if (response !== "") 
          dispatch(setComments(response));
      } catch (error) {
        console.log("erreur:"+error);
      }
      }
      getCommentaires();
  }, [_id,dispatch]);

  const commentSchema = Yup.object().shape({
    commentaire: Yup.string().required("Commentaire requis")
  });

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
  
  const handleAjouterCommentaire = async (values) => {
    if(!user) navigate("/login");
    try {
      const response = await addComment(values,_id,user._id); // Call the like API
      const formData = new FormData();
      formData.append("commentaire", values.commentaire);
      formData.append("email", author.email);
      formData.append("nom", user.name);
      sendEmail(formData);
      window.location.reload();
    } catch (error) {
      message.error(error.message); 
      console.error("Error adding comment:", error.message);
    }
  };

  return (
    <ThreadWrapper>
      {user && user._id === author._id && (
        <DeleteButton onClick={handleDelete}>
          <AiFillDelete size={20} />
        </DeleteButton>
      )}
      <ThreadHeader>
  
 {author.img  && (
        <Avatar src={`data: ${author.img.contentType};base64, ${Buffer.from(author.img.data).toString('base64')}`} alt={author.name} size={64} />
 )}    
        <div style={{ marginLeft: 12 }}>
          <ThreadTitle>{title}</ThreadTitle>
          <span>Par {author.name}</span>
          <br></br>
          <span>{createdAt.split('T')[0]}</span>
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
      <div>
        {comments.map((comment) => (
                <ThreadHeader key={comment._id}>
                  <div style={{verticalAlign:"top"}}><Avatar src={`data: ${comment.author.img.contentType};base64, ${Buffer.from(comment.author.img.data).toString('base64')}`} alt={author.name} size={32} /></div>
                  <table style={{width:"100%",padding:"5px",borderRadius:"5px",marginLeft:"5px",marginTop:"5px",backgroundColor:"#E5E4E2"}}>
                    <tbody>
                    <tr>
                      <td><span><b>{comment.author.name}</b></span></td>
                    </tr>
                    <tr>
                      <td><span>{comment.content}</span></td>
                    </tr>
                    </tbody>
                  </table>
                </ThreadHeader>
              ))}
      </div>
      {user && (
          <Formik
          initialValues={{ commentaire: "" }}
          validationSchema={commentSchema}
          onSubmit={handleAjouterCommentaire}
        >
          {({ errors, touched, isSubmitting })=> (
            <Form>
              <div>
                <br></br>
                <label htmlFor="commentaire">Commentaire:</label>
                <br></br>
                <Field
                  as={Input}
                  name="commentaire"
                  size="large"
                  placeholder="Entrez un commentaire"
                  style={{width:"240px"}} 
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  Ajouter
                </Button>
              </div>
              {touched.commentaire && errors.commentaire && (
                  <ErrorText>{errors.commentaire}</ErrorText>
                )}
            </Form>
          )}
          </Formik>
    )}
    </ThreadWrapper>
  );
};

export default Thread;
