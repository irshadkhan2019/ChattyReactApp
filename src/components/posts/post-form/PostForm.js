import { useDispatch, useSelector } from "react-redux";
import Avatar from "./../../avatar/Avatar";
import Input from "./../../inputs/Input";
import photo from "./../../../assets/images/photo.png";
import gif from "./../../../assets/images/gif.png";
import feeling from "./../../../assets/images/feeling.png";

import "./PostForm.scss";
import { openModal } from "../../../redux-toolkit/reducers/modal/modal.reducer";
import AddPost from "../post-modal/post-add/AddPost";

const PostForm = () => {
  const { profile } = useSelector((state) => state.user);
  const { type, isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const openPostmodal = () => {
    dispatch(openModal({ type: "add" }));
  };
  return (
    <>
      <div className="post-form" data-testid="post-form">
        <div className="post-form-row">
          <div className="post-form-header">
            <h4 className="post-form-title">Create Post</h4>
          </div>
          <div className="post-form-body">
            <div
              className="post-form-input-body"
              data-testid="input-body"
              onClick={() => openPostmodal()}
            >
              <Avatar
                name={profile?.username}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture}
              />
              <div
                className="post-form-input"
                data-placeholder="Write something here..."
              ></div>
            </div>
            <hr />
            <ul className="post-form-list" data-testid="list-item">
              <li className="post-form-list-item image-select">
                <Input name="image" type="file" className="file-input" />
                <img src={photo} alt="" /> Photo
              </li>
              <li className="post-form-list-item">
                <img src={gif} alt="" /> Gif
              </li>
              <li className="post-form-list-item">
                <img src={feeling} alt="" /> Feeling
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* DISPLAY ADD POST MODAL */}
      {isOpen && type === "add" && <AddPost />}
    </>
  );
};

export default PostForm;
