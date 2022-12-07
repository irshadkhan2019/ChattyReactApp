import photo from "./../../../../assets/images/photo.png";
import video from "./../../../../assets/images/video.png";
import gif from "./../../../../assets/images/gif.png";
import feeling from "./../../../../assets/images/feeling.png";
import Input from "../../../inputs/Input";
import useDetectOutsideClick from "./../../../../hooks/useDetectOutsideClick";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Feelings from "../../../feelings/Feelings";
import { ImageUtils } from "../../../../services/utils/image-utils.service";
import PropTypes from "prop-types";
import { toggleGifModal } from "../../../../redux-toolkit/reducers/modal/modal.reducer";

const ModalBoxSelection = ({ setSelectedPostImage, setSelectedVideo }) => {
  const { feelingIsOpen, gifModalIsOpen } = useSelector((state) => state.modal);
  const { post } = useSelector((state) => state.post);
  const feelingsRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [togglefeelings, setToggleFeelings] = useDetectOutsideClick(
    feelingsRef,
    feelingIsOpen
  );

  const dispatch = useDispatch();

  const fileInputCicked = () => {
    //triggers input as clicked
    fileInputRef.current.click();
  };

  const videoInputCicked = () => {
    //triggers input as clicked
    videoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // console.log(event.target.files[0]);
    ImageUtils.addFileToRedux(
      event,
      post,
      setSelectedPostImage,
      dispatch,
      "image"
    );
  };

  const handleVideoFileChange = (event) => {
    // console.log(event.target.files[0]);
    ImageUtils.addFileToRedux(event, post, setSelectedVideo, dispatch, "video");
  };

  return (
    <>
      {togglefeelings && (
        <div ref={feelingsRef}>
          <Feelings />
        </div>
      )}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          {/* image selection */}
          <li
            className="post-form-list-item image-select"
            onClick={fileInputCicked}
          >
            <Input
              name="image"
              ref={fileInputRef}
              type="file"
              className="file-input"
              onClick={() => {
                // clears previously selected image to avoid bug when selecting img 2nd time
                if (fileInputRef.current) {
                  console.log("clearing previous file");
                  fileInputRef.current.value = null;
                }
              }}
              handleChange={handleFileChange}
            />
            <img src={photo} alt="" /> Photo
          </li>
          {/* enable giphy modal to select gifs */}
          <li
            className="post-form-list-item"
            onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
          >
            <img src={gif} alt="" /> Gif
          </li>
          {/* feelings dropdown secrion */}
          <li
            className="post-form-list-item"
            onClick={() => setToggleFeelings(!togglefeelings)}
          >
            <img src={feeling} alt="" /> Feeling
          </li>
          {/* video selection */}
          <li
            className="post-form-list-item image-select"
            onClick={videoInputCicked}
          >
            <Input
              name="video"
              ref={videoInputRef}
              type="file"
              className="file-input"
              onClick={() => {
                // clears previously selected image to avoid bug when selecting img 2nd time
                if (videoInputRef.current) {
                  console.log("clearing previous file");
                  videoInputRef.current.value = null;
                }
              }}
              handleChange={handleVideoFileChange}
            />
            <img src={video} alt="" /> Video
          </li>
        </ul>
      </div>
      ;
    </>
  );
};

ModalBoxSelection.propTypes = {
  setSelectedPostImage: PropTypes.func,
  setSelectedVideo: PropTypes.func,
};
export default ModalBoxSelection;
