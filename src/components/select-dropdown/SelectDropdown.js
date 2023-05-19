import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { updatePostItem } from "../../redux-toolkit/reducers/post/post.reducer";
import "./SelectDropdown.scss";

// FOR PRIVACY in POST creation

/*SAMPLE items
topText: "Public",
subText: "Anyone on SocialApp",
icon: <FaGlobe className="globe-icon globe" />,
*/
const SelectDropdown = ({ isActive, setSelectedItem, items = [] }) => {
  console.log("PRIVACY_DROPDOWN",isActive,items);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const selectItem = (item) => {
    setSelectedItem(item);
    //set selected privacy in post
    dispatch(updatePostItem({ privacy: item.topText }));
  };

  return (
    <div className="menu-container" data-testid="menu-container">
      <nav
        ref={dropdownRef}
        // hide/show dropdown based on inactive passed via parent component  isActive={togglePrivacy} in ModalBoxComp
        className={`menu ${isActive ? "active" : "inactive"}`}
      >
        <ul>
          {items.map((item, index) => (
            <li
              data-testid="select-dropdown"
              key={index}
              onClick={() => selectItem(item)}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-text">
                <div className="menu-text-header">{item.topText}</div>
                <div className="sub-header">{item.subText}</div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

SelectDropdown.propTypes = {
  isActive: PropTypes.bool,
  setSelectedItem: PropTypes.func,
  items: PropTypes.array,
};

export default SelectDropdown;
