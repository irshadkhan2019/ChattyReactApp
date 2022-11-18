import React, { useState } from "react";
import { useSelector } from "react-redux";
import PostWrapper from "../../modal-wrappers/post-wrapper/PostWrapper";
import ModalBoxContent from "../modal-box-content/ModalBoxContent";
import "./AddPost.scss";

const AddPost = () => {
  const { gifModalIsOpen } = useSelector((state) => state.modal);
  const [loading] = useState();
  return (
    <>
      <PostWrapper>
        <div></div>

        {!gifModalIsOpen && (
          <div className="modal-box">
            {loading && (
              <div
                className="modal-box-loading"
                data-testid="modal-box-loading"
              >
                <span>Posting......</span>
              </div>
            )}
            <div className="modal-box-header">
              <h2> Create Post</h2>
              <button className="modal-box-header-cancel">X</button>
            </div>
            <hr />
            <ModalBoxContent />
          </div>
        )}

        {gifModalIsOpen && <div>Gif</div>}
      </PostWrapper>
    </>
  );
};

export default AddPost;
