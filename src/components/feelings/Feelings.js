import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPostFeeling,
  toggleFeelingModal,
} from "../../redux-toolkit/reducers/modal/modal.reducer";
import { feelingsList } from "../../services/utils/static.data";
import "./Feelings.scss";

const Feelings = () => {
  const { feelingIsOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const selectFeeling = (feeling) => {
    dispatch(addPostFeeling({ feeling }));
    dispatch(toggleFeelingModal(!feelingIsOpen));
  };

  return (
    <div className="feelings-container">
      <div className="feelings-container-picker">
        <p>Feelings</p>
        <hr></hr>
        <ul className="feelings-container-picker-list">
          {feelingsList.map((feeling) => (
            <li
              onClick={() => selectFeeling(feeling)}
              data-testid="feeling-item"
              className="feelings-container-picker-list-item"
              key={feeling.index}
            >
              <img src={feeling.image} alt="" />
              <span>{feeling.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Feelings;
