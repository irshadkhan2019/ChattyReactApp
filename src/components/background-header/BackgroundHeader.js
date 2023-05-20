import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Spinner from "./../spinner/Spinner";
import Button from "./../button/Button";
import Avatar from "../avatar/Avatar";
import Input from "../inputs/Input";
import { FaCamera } from "react-icons/fa";
import "./BackgroundHeader.scss";
import { useEffect } from "react";
import ImageGridModal from "../image-grid-modal/ImageGridModal";
import BackgroundHeaderSkeleton from "./BackgroundHeaderSkeleton";

const BackgroundHeader = ({
  user,
  loading,
  url, //after user saved backgroundimg  i.e cloudinary image url
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
  // b4 user saved i,e after user selects background img as file . 
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

  // used to display BackgroundSelectDropdown options to upload bgimage
  const onAddProfileClick = () => setIsActive(!isActive);

  // when clicked to add cover photo
  const BackgroundSelectDropdown = () => {
    return (
      <nav className="menu" data-testid="menu">

        <ul>
          {galleryImages.length > 0 && (
            <li
              onClick={() => {
                // to upload from already existing galleryimages ->setShowImagesModal
                setShowImagesModal(true);
                setIsActive(false);
              }}
            >
              <div className="item">Select</div>
            </li>
          )}
          <li
            onClick={() => {
              //to upload new img file
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

  useEffect(() => {
    if (!hasImage) {
      setShowSpinner(false);
    }
  }, [hasImage]);

  return (
    <>
      {/* {console.log("selectedBackground", selectedBackground, "url", url)} */}
      {/* to select bg image from his  already existing  gallery images  */}
      {showImagesModal && (

        <ImageGridModal
          images={galleryImages}
          closeModal={() => setShowImagesModal(false)}
          // event is image passed when this fn  called in ImageGridModal
          selectedImage={(event) => {
            setSelectedBackground(event);
            // since bg selected type=="background"
            selectedFileImage(event, "background");
          }}
        />
      )}
      {loading ? (
        <BackgroundHeaderSkeleton tabItems={tabItems} />
      ) : (
        <div className="profile-banner" data-testid="profile-banner">

          {/* If user seleceted his bg image to upload then show cancel button to cancel his file img
              selection */}
          {hasImage && (
            <div
              className="save-changes-container"
              data-testid="save-changes-container"
            >
              <div className="save-changes-box">
                <div className="spinner-container">
                  {showSpinner && !hasError && <Spinner bgColor="white" />}
                </div>
                <div className="save-changes-buttons">
                  <div className="save-changes-buttons-bg">
                    {/* cancel the sected bg image/ profile img  */}
                    <Button
                      label="Cancel"
                      className="cancel change-btn"
                      disabled={false}
                      handleClick={() => {
                        console.log("canceling the selction");
                        setShowSpinner(false);
                        cancelFileSelection();
                        hideSaveChangesContainer();
                      }}
                    />
                    {/* save the sected bg image to db as new bg image*/}
                    <Button
                      label="Save Changes"
                      className="save change-btn"
                      disabled={false}
                      handleClick={() => {
                        setShowSpinner(true);
                        const type = selectedBackground
                          ? "background"
                          : "profile";
                        // To save the previewd bgimg/profile picture
                        console.log("btn->saving the file",type);
                        saveImage(type);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* display banner/bgimage section  in profile page  */}
          <div
            data-testid="profile-banner-image"
            className="profile-banner-image"
            // if no bgimage in db then bg color is same as his avatar 
            style={{
              background: `${!selectedBackground ? user?.avatarColor : ""}`,
            }}
          >
             {/* if bgimage exist in db and user is viewing his own profile page  */}
            {url && hideSettings && (
              <div className="delete-btn" data-testid="delete-btn">
                <Button
                  label="Remove"
                  className="remove"
                  disabled={false}
                  handleClick={() => {
                    removeBackgroundImage(user?.bgImageId);
                  }}
                />
              </div>
            )}
            {/* selectedBackground ->new selection  &&  url ->existing db image*/}
            {!selectedBackground && !url && <h3>Add a background image</h3>}
            
            {/* if users selects bg image then display it in place of its db bgimage */}
            {selectedBackground ? (
              <img src={`${selectedBackground}`} alt="" />
            ) : (
              // else display his db bgimage
              <img src={`${url}`} alt="" />
            )}
          </div>

          {/* Display Profile picture section */}
          <div className="profile-banner-data">
            <div
              data-testid="profile-pic"
              className="profile-pic"
              // dynamic styles based on user have profilepic in db
              style={{
                width: `${user?.profilePicture ? "180px" : ""}`,
              }}
            >
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={180}
                // if user selects a new profile pic to upload then show it as preview->selectedProfileImage
                //else display his db profile pic
                avatarSrc={selectedProfileImage || user?.profilePicture}
              />
              {/* show option to upload profile pic if user is viewing his own profile page ->hideSetting */}
              {hideSettings && (
                <div
                  className="profile-pic-select"
                  data-testid="profile-pic-select"
                >
                  <Input
                    ref={profileImageRef}
                    name="profile"
                    type="file"
                    className="inputFile"
                    onClick={() => {
                      if (profileImageRef.current) {
                        profileImageRef.current.value = null;
                      }
                    }}
                    handleChange={(event) => {
                      console.log("profie img selction",event);
                   // to let the component dispay this img as preview in place of already existing db profule img
                      setSelectedProfileImage(
                        URL.createObjectURL(event.target.files[0])
                      );
                    // since profile selected type=="profile"
                      selectedFileImage(event.target.files[0], "profile");
                    }}
                  />
                  <label onClick={() => profileFileInputClicked()}>
                    <FaCamera className="camera" />
                  </label>
                </div>
              )}
            </div>
            <div className="profile-name">{user?.username}</div>

              {/* show option to upload bg image/banner pic if user is viewing his own profile page ->hideSetting */}
            {hideSettings && (
              <div className="profile-select-image">
                <Input
                  ref={backgroundFileRef}
                  name="background"
                  type="file"
                  className="inputFile"
                  onClick={() => {
                    if (backgroundFileRef.current) {
                      backgroundFileRef.current.value = null;
                    }
                  }}
                  handleChange={(event) => {
                    // preview his bg image 
                    setSelectedBackground(
                      URL.createObjectURL(event.target.files[0])
                    );
                    // since bg selected type=="background"
                    selectedFileImage(event.target.files[0], "background");
                  }}
                />
                <label
                  data-testid="add-cover-photo"
                  onClick={() => onAddProfileClick()}
                >
                  <FaCamera className="camera" /> <span>Add Cover Photo</span>
                </label>
                {isActive && <BackgroundSelectDropdown />}
              </div>
            )}
          </div>
          {/* Tab items sectiion */}
          <div className="profile-banner-items">
            <ul className="banner-nav">
              {tabItems.map((data) => (
                <div data-testid="tab-elements" key={data.key}>
                  {data.show && (
                    <li className="banner-nav-item" key={data.key}>
                      <div
                        className={`banner-nav-item-name ${
                          tab === data.key.toLowerCase() ? "active" : ""
                        }`}

                      // onCLick calls changeTabContent in Profile page which updates DisplayContent with the data.key
                        onClick={() => onClick(data.key.toLowerCase())}
                      >
                        {data.icon}
                        <p className="title">{data.key}</p>
                      </div>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
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
