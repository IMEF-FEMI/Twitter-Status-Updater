import React from "react";

export default props =>
  props.images.map((image, i) => (
    <div key={i} className="fadein">
      <div onClick={() => props.removeImage(image)} className="delete">
        <i className="fas fa-times-circle" />
      </div>
      <img
        src={image.fileSrc}
        alt={`${image.file.name}`}
        onClick={() => props.removeImage(image)}
      />
    </div>
  ));
