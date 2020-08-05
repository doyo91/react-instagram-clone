import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { db, storage } from "../../services/firebase";
import firebase from "firebase";

const ImageUploadStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10px;
  margin-bottom: 10px;

  .imageupload__progress {
    width: 100%;
  }
`;

export const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // function only visual
        // progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function...
        console.log(error);
        alert(error.message);
      },
      () => {
        //   complete function...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <ImageUploadStyled>
      <progress className="imageupload__progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </ImageUploadStyled>
  );
};
