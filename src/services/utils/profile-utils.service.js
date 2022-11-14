import { createSearchParams } from "react-router-dom";

export class ProfileUtils {
  static navigateToProfile(profile, navigate) {
    const url = `/app/social/profile/${profile.username}?${createSearchParams({
      id: profile?._id,
      uId: profile?.uId,
    })}`;
    navigate(url);
  }
}
