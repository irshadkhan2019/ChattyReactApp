import { AuthTabs, ResetPassword, ForgotPassword } from "./pages/auth";
import { useRoutes } from "react-router-dom";

import Social from "./pages/social/Social";
import Streams from "./pages/social/streams/Streams";
import Chat from "./pages/social/chat/Chat";
import People from "./pages/social/people/People";
import Followers from "./pages/social/followers/Followers";
import Following from "./pages/social/following/Following";
import Photos from "./pages/social/photos/Photos";
import Notifications from "./pages/social/notifications/Notifications";
import Profile from "./pages/social/profile/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import Error from "./pages/error/Error";
import { Suspense } from "react";
import StreamsSkeleton from "./pages/social/streams/StreamsSkeleton";
//every pages except auth are protected routes
export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: "/",
      element: <AuthTabs />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      //wrap parent as protected routes makes children also protected
      path: "/app/social/",
      element: (
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      ),
      //children components are displayed in Outlet specified in parent component
      children: [
        {
          path: "streams",
          element: (
            //while still loading Streams display fallback component ie
            //display StreamsSkeleton untill data is loaded in Streams
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          ),
        },
        {
          path: "chat/messages",
          element: <Chat />,
        },
        {
          path: "people",
          element: <People />,
        },
        {
          path: "followers",
          element: <Followers />,
        },
        {
          path: "following",
          element: <Following />,
        },
        {
          path: "photos",
          element: <Photos />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "profile/:username",
          element: <Profile />,
        },
      ],
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);

  return elements;
};
