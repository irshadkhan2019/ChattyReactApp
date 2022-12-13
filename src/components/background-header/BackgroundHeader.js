import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Spinner from "./../spinner/Spinner";
import Button from "./../button/Button";
import Avatar from "../avatar/Avatar";
import Input from "../inputs/Input";
import { FaCamera } from "react-icons/fa";
import "./BackgroundHeader.scss";

const BackgroundHeader = ({
  user,
  loading,
  url,
  onClick,
  tab,
  hasImage,
  tabItems,
  hasError,
  hideSettings,
  selectedFileImage,
  saveImage,
  cancelFileSelection,
  removeBackgroundImage,
  galleryImages,
}) => {
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const backgroundFileRef = useRef();
  const profileImageRef = useRef();

  const backgroundFileInputClicked = () => {
    backgroundFileRef.current.click();
  };

  const profileFileInputClicked = () => {
    profileImageRef.current.click();
  };

  const hideSaveChangesContainer = () => {
    setSelectedBackground("");
    setSelectedProfileImage("");
    setShowSpinner(false);
  };

  const BackgroundSelectDropdown = () => {
    return (
      <nav className="menu" data-testid="menu">
        <ul>
          {galleryImages.length > 0 && (
            <li
              onClick={() => {
                setShowImagesModal(true);
                setIsActive(false);
              }}
            >
              <div className="item">Select</div>
            </li>
          )}
          <li
            onClick={() => {
              backgroundFileInputClicked();
              setIsActive(false);
              setShowImagesModal(false);
            }}
          >
            <div className="item">Upload</div>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <div className="profile-banner" data-testid="profile-banner">
        <div
          className="save-changes-container"
          data-testid="save-changes-container"
        >
          <div className="save-changes-box">
            <div className="spinner-container">
              <Spinner bgColor="white" />
            </div>
            <div className="save-changes-buttons">
              <div className="save-changes-buttons-bg">
                <Button
                  label="Cancel"
                  className="cancel change-btn"
                  disabled={false}
                />
                <Button
                  label="Save Changes"
                  className="save change-btn"
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          data-testid="profile-banner-image"
          className="profile-banner-image"
        >
          <div className="delete-btn" data-testid="delete-btn">
            <Button label="Remove" className="remove" disabled={false} />
          </div>
          <h3>Add a background image</h3>
          <img src="" alt="" />
        </div>
        <div className="profile-banner-data">
          <div data-testid="profile-pic" className="profile-pic">
            <Avatar
              name={user?.username}
              bgColor={user?.avatarColor}
              textColor="#ffffff"
              size={180}
              avatarSrc=""
            />
            <div
              className="profile-pic-select"
              data-testid="profile-pic-select"
            >
              <Input type="file" className="inputFile" />
              <label>
                <FaCamera className="camera" />
              </label>
            </div>
          </div>
          <div className="profile-name">Danny</div>
          <div className="profile-select-image">
            <Input type="file" className="inputFile" />
            <label data-testid="add-cover-photo">
              <FaCamera className="camera" /> <span>Add Cover Photo</span>
            </label>
            Background select dropdown
          </div>
        </div>
        <div className="profile-banner-items">
          <ul className="banner-nav">
            <div data-testid="tab-elements">
              <li className="banner-nav-item">
                <div className="banner-nav-item-name">
                  Icon
                  <p className="title">Item</p>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

BackgroundHeader.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool,
  url: PropTypes.string,
  onClick: PropTypes.func,
  tab: PropTypes.string,
  hasImage: PropTypes.bool,
  tabItems: PropTypes.array,
  hasError: PropTypes.bool,
  hideSettings: PropTypes.bool,
  selectedFileImage: PropTypes.func,
  saveImage: PropTypes.func,
  cancelFileSelection: PropTypes.func,
  removeBackgroundImage: PropTypes.func,
  galleryImages: PropTypes.array,
};

export default BackgroundHeader;
