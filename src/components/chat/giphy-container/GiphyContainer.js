import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa";
import Input from "../../inputs/Input";
import { GiphyUtils } from "./../../../services/utils/giphy-utils.service";
import Spinner from "./../../spinner/Spinner";
import { Utils } from "./../../../services/utils/utils.service";
import "./GiphyContainer.scss";

const GiphyContainer = ({ handleGiphyClick }) => {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GiphyUtils.getTrendingGifs(setGifs, setLoading);
  }, []);

  return (
    <div className="giphy-search-container" data-testid="giphy-container">
      <div className="giphy-search-input">
        <FaSearch className="search" />
        <Input
          id="gif"
          name="gif"
          type="text"
          labelText=""
          placeholder="Search Gif"
          className="search-input"
          handleChange={(e) =>
            GiphyUtils.searchGifs(e.target.value, setGifs, setLoading)
          }
        />
      </div>

      {loading && <Spinner />}

      <ul className="search-results" data-testid="unorderedList">
        {gifs.map((gif) => (
          <li
            className="gif-result"
            data-testid="list-item"
            key={Utils.generateString(10)}
            onClick={() => {
              // console.log(gif);
              handleGiphyClick(gif.images.original.url);
            }}
          >
            <img src={`${gif.images.original.url}`} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

GiphyContainer.propTypes = {
  handleGiphyClick: PropTypes.func,
};

export default GiphyContainer;
