import PropTypes from "prop-types";
import { Utils } from "../../services/utils/utils.service";
import ReactionWrapper from "./../posts/modal-wrappers/reaction-wrapper/ReactionWrapper";
import "./ImageGridModal.scss";

const ImageGridModal = ({ images, closeModal, selectedImage }) => {
  return (
    <ReactionWrapper closeModal={closeModal}>
      <div className="modal-image-header">
        <h2>Select Photo</h2>
      </div>
      <div className="modal-image-container">
        {images.map((data, index) => (
          <img
            key={index}
            className="grid-image"
            alt=""
            src={`${Utils.getPostImage(data?.imgId, data?.imgVersion)}`}
            onClick={() => {
              // since img is selecetd from gallery images we have its id and version,so pass as event var
              selectedImage(Utils.getPostImage(data?.imgId, data?.imgVersion));
              closeModal();
            }}
          />
        ))}
      </div>
    </ReactionWrapper>
  );
};

ImageGridModal.propTypes = {
  images: PropTypes.array,
  closeModal: PropTypes.func,
  selectedImage: PropTypes.func,
};

export default ImageGridModal;
