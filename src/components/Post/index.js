import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../../services/firebase";
import firebase from "firebase";

const PostStyled = styled.div`
  max-width: 500px;
  background-color: white;
  border: 1px solid lightgray;
  margin-bottom: 40px;
  .post__image {
    width: 100%;
    object-fit: contain;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
  }

  .post__header {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .post__avatar {
    margin-right: 10px;
  }

  .post__text {
    font-weight: normal;
    padding: 20px;
  }

  .post__commentBox {
    display: flex;
    margin-top: 10px;
  }

  .post__comments {
    padding: 20px;
  }

  .post__input {
    flex: 1;
    border: none;
    padding: 10px;
    border-top: 1px solid lightgray;
  }

  .post__button {
    flex: 0;
    border: none;
    color: #6082a3;
    background-color: transparent;
    padding-right: 5px;
    border-top: 1px solid lightgray;
  }
`;

export const Post = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, comment: doc.data() }))
          );
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <PostStyled className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username + "avatar"}
          src="/static/images/avatar/1.jpg"
        />
        <h3 className="post__user">{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="image" />
      <h4 className="post__text">
        <strong>{username} </strong>
        {caption}
      </h4>

      <div className="post__comments">
        {comments.map(({ id, comment }) => (
          <p key={id}>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            type="text"
            className="post__input"
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </PostStyled>
  );
};
