import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import BackgroundHeader from "../../../components/background-header/BackgroundHeader";
import { userService } from "../../../services/api/user/user.service";
import { tabItems } from "../../../services/utils/static.data";
import { Utils } from "../../../services/utils/utils.service";
import "./Profile.scss";
import { imageService } from "./../../../services/api/image/image.service";
import Timeline from "../../../components/timeline/Timeline";
import FollowerCard from "../followers/FollowerCard";
import GalleryImage from "../../../components/gallery-image/GalleryImage";
import ChangePassword from "../../../components/change-password/ChangePassword";
import NotificationSettings from "../../../components/notification-settings/NotificationSettings";
import { toggleDeleteDialog } from "../../../redux-toolkit/reducers/modal/modal.reducer";
import ImageModal from "./../../../components/image-modal/ImageModal";
import { filter } from "lodash";
import Dialog from "./../../../components/dialog/Dialog";
import { ImageUtils } from "../../../services/utils/image-utils.service";

const Profile = () => {
  const { profile } = useSelector((state) => state.user);
  const { deleteDialogIsOpen, data } = useSelector((state) => state.modal);
  const [user, setUser] = useState();
  const [rendered, setRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState("");
  const [bgUrl, setBgUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  // for tabs
  const [displayContent, setDisplayContent] = useState("timeline");

  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const dispatch = useDispatch();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  // used to change tabitems
  const changeTabContent = (data) => {
    setDisplayContent(data);
  };

  // when users selects profile or background image to upload
  const selectedFileImage = (data, type) => {
    //set hasImage which enables Background header compoennt to display this image as preview and 
    //aslo prove cancel button to remove it or save btn to save to db as new bg image. 
    setHasImage(!hasImage);
    console.log("A file selected to preview",data,type);
    if (type === "background") {
      setSelectedBackgroundImage(data);
    } else {
      setSelectedProfileImage(data);
    }
  };

  // after selecting profile or background image if users choose to cancel the changes . 
  const cancelFileSelection = () => {
    setHasImage(!hasImage);
    setSelectedBackgroundImage("");
    setSelectedProfileImage("");
    setHasError(false);
  };

  const getUserProfileByUsername = useCallback(async () => {
    console.log("useParams():",username);
    try {
      const response = await userService.getUserProfileByUsername(
        username,
        searchParams.get("id"),
        searchParams.get("uId")
      );
      setUser(response.data.user);
      setUserProfileData(response.data);
      // set the user's uploaded bg image to display in page 
      setBgUrl(
        Utils.getPostImage(
          response?.data?.user.bgImageId,
          response?.data?.user.bgImageVersion
        )
      );
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [dispatch, searchParams, username]);

  // used to save the passed img file
  const saveImage = async (type) => {
    console.log("selectedProfileImg",selectedProfileImage);
    console.log("selectedBackgroundImage",selectedBackgroundImage);

    // const reader = new FileReader();
    // // after reader loads file it called addImage to save the loaded file to db . 
    // reader.addEventListener(
    //   "load",
    //   async () => addImage(reader.result, type),
    //   false
    // );
    
    // // if user select bg image from galleryImages instead of new img file . 
    // if (
    //   selectedBackgroundImage &&
    //   typeof selectedBackgroundImage !== "string"
    // ) {
    //   reader.readAsDataURL(Utils.renameFile(selectedBackgroundImage));
    // } else if (
    //   selectedProfileImage &&
    //   typeof selectedProfileImage !== "string"
    // ) {
    //   reader.readAsDataURL(Utils.renameFile(selectedProfileImage));
    // } else {
    //   addImage(selectedBackgroundImage, type);
    // }

    let result="";

    if(selectedProfileImage){
       result = await ImageUtils.readAsBase64(selectedProfileImage);
    }else if(selectedBackgroundImage){
         result = await ImageUtils.readAsBase64(selectedBackgroundImage);

    }
    addImage(result, type);
  };

  
  // save bg image or profile img to db
  const addImage = async (result, type) => {

    // according to type (profile or bg) preset url
    console.log("Finally saving file of type",type,"ACTUAL FILE::",result);
    try {
      const url =
        type === "background" ? "/images/background" : "/images/profile";
        //save image to db
      const response = await imageService.addImage(url, result);
      if (response) {
        Utils.dispatchNotification(response.data.message, "success", dispatch);
        setHasError(false);
        setHasImage(false);
      }
    } catch (error) {
      setHasError(true);
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  // when clicked cancel remove bg image  from db
  const removeBackgroundImage = async (bgImageId) => {
    try {
      setBgUrl("");
      await removeImage(`/images/background/${bgImageId}`);
    } catch (error) {
      setHasError(true);
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  // removes users bg image from db
  const removeImage = async (url) => {
    const response = await imageService.removeImage(url);
    Utils.dispatchNotification(response.data.message, "success", dispatch);
  };


  // used to delete image when clicked on trash icon and modal pops up .
  const removeImageFromGallery = async (imageId) => {
    try {
      // close dialog 
      dispatch(toggleDeleteDialog({ toggle: false, data: null }));
      const images = filter(galleryImages, (image) => image._id !== imageId);
      setGalleryImages(images);
    
      await removeImage(`/images/${imageId}`);
    } catch (error) {
      setHasError(true);
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  // get previous all images set up by user
  const getUserImages = useCallback(async () => {
    try {
      const imagesResponse = await imageService.getUserImages(
        searchParams.get("id")
      );
      //set the gallery wiht users old images
      setGalleryImages(imagesResponse.data.images);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (rendered) {
      getUserProfileByUsername();
      getUserImages();
    }
    if (!rendered) setRendered(true);
  }, [rendered, getUserProfileByUsername, getUserImages]);

  return (
    <>
      {console.log("User PROFILE DATA:", userProfileData)}

      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      )}
      {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this image?"
          showButtons={true}
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => removeImageFromGallery(data)}
          secondBtnHandler={() =>
            dispatch(toggleDeleteDialog({ toggle: false, data: null }))
          }
        />
      )}
      <div className="profile-wrapper">
        <div className="profile-wrapper-container">
          {/* background header component section */}

          <div className="profile-header">
            <BackgroundHeader
              user={user}
              loading={loading}
              hasImage={hasImage}
              hasError={hasError}
              url={bgUrl}
              onClick={changeTabContent} //used to change tab items
              selectedFileImage={selectedFileImage} //bg or profile image when selecetd
              saveImage={saveImage}
              cancelFileSelection={cancelFileSelection}
              removeBackgroundImage={removeBackgroundImage}
              // password and notification shown only when viewing logged in users profile. 
              tabItems={tabItems(
                username === profile?.username,
                username === profile?.username
              )}
              tab={displayContent}//current tab content displayed in screen
              hideSettings={username === profile?.username} //show setting only for loggedin usr profiles.
              galleryImages={galleryImages}
            />
          </div>

          {/* Based on displayCOntent tabs show other stabs componentns */}
          <div className="profile-content">
            {displayContent === "timeline" && (
              <Timeline userProfileData={userProfileData} loading={loading} />
            )}
            
            {displayContent === "followers" && <FollowerCard userData={user} />}
            {displayContent === "gallery" && (
              <>
                {galleryImages.length > 0 && (
                  <>
                    <div className="imageGrid-container">
                      {galleryImages.map((image) => (
                        <div key={image._id}>
                          <GalleryImage
                            showCaption={false}
                            showDelete={true}
                            imgSrc={Utils.getPostImage(
                              image?.imgId,
                              image.imgVersion
                            )}
                            onClick={() => {
                              setImageUrl(
                                Utils.getPostImage(
                                  image?.imgId,
                                  image.imgVersion
                                )
                              );
                              setShowImageModal(!showImageModal);
                            }}
                            onRemoveImage={(event) => {
                              event.stopPropagation();
                              dispatch(
                                toggleDeleteDialog({
                                  toggle: !deleteDialogIsOpen,
                                  data: image?._id,
                                })
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            {displayContent === "change password" && <ChangePassword />}
            {displayContent === "notifications" && <NotificationSettings />}
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
