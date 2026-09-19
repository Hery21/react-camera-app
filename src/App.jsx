import { useRef, useState } from "react";
import { useCamera } from "./hooks/useCamera";
import { PHOTO_WIDTH, PHOTO_HEIGHT } from "./constants/camera";
import Camera from "./components/Camera";
import PhotoPreview from "./components/PhotoPreview";

export default function App() {
  const { videoRef, error } = useCamera();
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const takePhoto = () => {
    const photo = photoRef.current;
    photo.width = PHOTO_WIDTH;
    photo.height = PHOTO_HEIGHT;
    photo
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
    setHasPhoto(true);
  };

  const closePhoto = () => {
    const photo = photoRef.current;
    photo.getContext("2d").clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  return (
    <div className="App">
      <Camera videoRef={videoRef} onSnap={takePhoto} error={error} />
      <PhotoPreview
        photoRef={photoRef}
        hasPhoto={hasPhoto}
        onClose={closePhoto}
      />
    </div>
  );
}
