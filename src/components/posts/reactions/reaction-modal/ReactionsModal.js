import { filter, orderBy, some } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "../../../../services/api/post/post.service";
import {
  reactionsColor,
  reactionsMap,
} from "../../../../services/utils/static.data";
import { Utils } from "../../../../services/utils/utils.service";
import ReactionWrapper from "../../modal-wrappers/reaction-wrapper/ReactionWrapper";
import ReactionList from "./reaction-list/ReactionList";
import useEffectOnce from "./../../../../hooks/useEffectOnce";
import { clearPost } from "../../../../redux-toolkit/reducers/post/post.reducer";
import { closeModal } from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import "./ReactionsModal.scss";

const ReactionsModal = () => {
  // get the post from redux which was clicked
  const { _id, reactions } = useSelector((state) => state.post);

  const [activeViewAllTab, setActiveViewAllTab] = useState(true);
  const [formattedReactions, setFormattedReactions] = useState([]);
  const [reactionType, setReactionType] = useState("");
  const [reactionColor, setReactionColor] = useState("");
  // reactions displayed in popup modal based on its type(filtered)
  const [postReactions, setPostReactions] = useState([]);

  // reactions displayed in popup modal based of all type(all reactions)
  const [reactionsOfPost, setReactionsOfPost] = useState([]);
  const dispatch = useDispatch();

  const getPostReactions = async () => {
    try {
      const response = await postService.getPostReactions(_id);
      console.log("REACTIONMODEL posts all reaction",response.data.reactions);
      const orderedPosts = orderBy(
        response?.data?.reactions,
        ["createdAt"],
        ["desc"]
      );
      setPostReactions(orderedPosts);
      setReactionsOfPost(orderedPosts);
    } catch (error) {
      Utils.dispatchNotification(
        error?.response?.data.message,
        "error",
        dispatch
      );
    }
  };

  const closeReactionModel = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };

  // when type is view all update postReactions as reactionsOfPost(contains all reactions)
  const viewAll = () => {
    // console.log(reactionsOfPost);
    setActiveViewAllTab(true);
    setReactionType("");
    // set the posts having filterd posts 
    setPostReactions(reactionsOfPost);
  };

  const reactionList = (type) => {
    console.log("Filtering type", type);
    setActiveViewAllTab(false);
    // change reaction type so that tab changes from all to particluar R.type
    setReactionType(type);
    //filter the reaction having the mentioned type only.
    const exist = some(reactionsOfPost, (reaction) => reaction.type === type);
    const filteredReaction = exist
      ? filter(reactionsOfPost, (reaction) => reaction.type === type)
      : [];

    // console.log(filteredReaction);
    setPostReactions(filteredReaction);
    setReactionColor(reactionsColor[type]);
    console.log("Filtered reactions of type:",type, filteredReaction);

  };

  useEffectOnce(() => {
    getPostReactions();
    setFormattedReactions(Utils.formattedReactions(reactions));
  });
  return (
    <>
      <ReactionWrapper closeModal={closeReactionModel}>
        {/* child 1 */}
        <div className="modal-reactions-header-tabs">
          <ul className="modal-reactions-header-tabs-list">
            <li
              className={`${activeViewAllTab ? "activeViewAllTab" : "all"}`}
              style={{ cursor: "pointer" }}
              onClick={viewAll}
            >
              All
            </li>
            {formattedReactions.map((reaction, index) => (
              <li
                key={Utils.generateString(10)}
                className={`${
                  reaction.type === reactionType ? "activeTab" : ""
                }`}
                style={{
                  color: `${
                    reaction.type === reactionType ? reactionColor : ""
                  }`,
                  cursor: "pointer",
                }}
                onClick={() => reactionList(reaction?.type)}
              >
                <img src={`${reactionsMap[reaction?.type]}`} alt="" />
                <span>{Utils.shortenLargeNumbers(reaction?.value)}</span>
                
              </li>
            ))}
          </ul>
        </div>
        {/* child 2 */}
        {/* Displays lists of users who made reactions */}
        <div className="modal-reactions-list">
          <ReactionList postReactions={postReactions} />
        </div>
      </ReactionWrapper>
    </>
  );
};

export default ReactionsModal;
