import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleGifModal } from "../../redux-toolkit/reducers/modal/modal.reducer";
import { updatePostItem } from "../../redux-toolkit/reducers/post/post.reducer";
import { GiphyUtils } from "../../services/utils/giphy-utils.service";
import { Utils } from "../../services/utils/utils.service";
import Input from "../inputs/Input";
import Spinner from "../spinner/Spinner";

import "./Giphy.scss";

const Giphy = () => {
  const { gifModalIsOpen } = useSelector((state) => state.modal);
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const selectGif = (gif) => {
    // update redux post store with selected gif url 
    dispatch(updatePostItem({ gifUrl: gif, image: "" }));
    // update redux modal store to open/close gif modal popup
    dispatch(toggleGifModal(!gifModalIsOpen));
  };

  useEffect(() => {
    GiphyUtils.getTrendingGifs(setGifs, setLoading);
  }, []);

  return (
    <>
      <div
        className="giphy-container"
        id="editable"
        data-testid="giphy-container"
      >
        <div className="giphy-container-picker" style={{ height: "500px" }}>
          <div className="giphy-container-picker-form">
            <FaSearch className="search" />
            <Input
              id="gif"
              name="gif"
              type="text"
              labelText=""
              placeholder="Search Gif"
              className="giphy-container-picker-form-input"
              handleChange={(e) =>
                GiphyUtils.searchGifs(e.target.value, setGifs, setLoading)
              }
            />
          </div>

          {loading && <Spinner />}

          <ul
            className="giphy-container-picker-list"
            data-testid="unorderedList"
          >
            {gifs.map((gif, index) => (
              <li
                className="giphy-container-picker-list-item"
                data-testid="list-item"
                key={Utils.generateString(10)}
                onClick={() => {
                  // console.log(gif);
                  selectGif(gif.images.original.url);
                }}
              >
                <img
                  style={{ width: "470px" }}
                  src={`${gif.images.original.url}`}
                  alt=""
                />
              </li>
            ))}
          </ul>

          {!gifs && !loading && (
            <ul className="giphy-container-picker-list">
              <li className="giphy-container-picker-list-no-item">
                No GIF found
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
export default Giphy;
