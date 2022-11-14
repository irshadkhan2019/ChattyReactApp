import SuggestionsSkeletons from "../../../components/suggestions/SuggestionsSkeleton";
import "./Streams.scss";

const StreamsSkeleton = () => {
  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post">
          <div>Post Form</div>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
              <div>Post Item</div>
            </div>
          ))}
        </div>
        <div className="streams-suggestions">
          <SuggestionsSkeletons />
        </div>
      </div>
    </div>
  );
};

export default StreamsSkeleton;
