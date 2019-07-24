import React, { useState } from "react";
import Images from "./components/Images";
import Spinner from "./components/Spinner";
import axios from "axios";
import "./App.css";

function App() {
	// stats
  const [inputValue, onInputChange] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);

	// add each file to the formData
    const data = new FormData();
    images.map((image, i) => {
      return data.append(i, image.file);
    });

	// fiinally append the tweet text itself
    data.append("tweet_text", JSON.stringify(inputValue));
    onInputChange("");
    setImages([]);

	// configuration for axios
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post(`/update-status`, data, config)
      .then(res => {
        if (res.data.success) {
          setLoading(false);
          alert("Status update successful");
        } else {
          alert("error updating status");
          setLoading(false);
        }
      })
      .catch(err => {
        alert("error updating status");
        setLoading(false);
      });
  };
  const handleChange = e => {
    onInputChange(e.target.value);
    console.log(e.target.value);
  };

  const onFileSelect = async e => {
	//   twitter file limits 
    const imgSize = 5242880; //5mb
    const vidSize = 15728640; //15mb
    const file = e.target.files[0]; //the actual file
    const fileSrc = e.target.files[0] && URL.createObjectURL(e.target.files[0]); //only used to display image thumb on client

    if (
      (file.type.includes("image") && file.size <= imgSize) ||
      (file.type.includes("video") && file.size <= vidSize)
    ) {
		// update images state
      const newImages = [...images, { fileSrc: fileSrc, file: file }];
      await setImages(newImages);
    } else {
      if (!file.type.includes("image") && !file.type.includes("video")) {
        alert("file type not supported");
      } else {
        alert("file too large");
      }
    }
  };

  const onFileRemove = file => {
	//   remove file
    setImages(images.filter(image => image !== file));
  };
  return (
    <div className="Main-App">
      <h2> Twitter Status Updater (With Media)</h2>
      <form
        method="post"
        action=""
        encType="multipart/form-data"
        onSubmit={onSubmit}
      >
        <input
          onChange={handleChange}
          value={inputValue}
          placeholder="Whats happening..."
          type="text"
        />
        <button type="submit">Tweet</button>
      </form>
      <div
        style={{
          marginTop: "20px",
          marginLeft: "29px"
        }}
      >
        <input type="file" onChange={onFileSelect} />
        {loading && <Spinner />}
        {images.length > 0 && (
          <Images images={images} removeImage={onFileRemove} />
        )}
      </div>
    </div>
  );
}

export default App;
