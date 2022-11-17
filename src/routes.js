import { AuthTabs, ResetPassword, ForgotPassword } from "./pages/auth";
import { useRoutes } from "react-router-dom";

import ProtectedRoute from "./pages/ProtectedRoute";
import Error from "./pages/error/Error";
import { Suspense, lazy } from "react";
import StreamsSkeleton from "./pages/social/streams/StreamsSkeleton";
import NotificationSkeleton from "./pages/social/notifications/NotificationSkeleton";

//Load component when needed via lazy callback dynamically
const Social = lazy(() => import("./pages/social/Social"));
const Chat = lazy(() => import("./pages/social/chat/Chat"));
const Followers = lazy(() => import("./pages/social/followers/Followers"));
const Following = lazy(() => import("./pages/social/following/Following"));
const Notification = lazy(() =>
  import("./pages/social/notifications/Notifications")
);
const People = lazy(() => import("./pages/social/people/People"));
const Photos = lazy(() => import("./pages/social/photos/Photos"));

const Profile = lazy(() => import("./pages/social/profile/Profile"));
const Streams = lazy(() => import("./pages/social/streams/Streams"));

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
          element: (
            <Suspense>
              <Chat />
            </Suspense>
          ),
        },
        {
          path: "people",
          element: (
            <Suspense>
              <People />
            </Suspense>
          ),
        },
        {
          path: "followers",
          element: (
            <Suspense>
              <Followers />
            </Suspense>
          ),
        },
        {
          path: "following",
          element: (
            <Suspense>
              <Following />
            </Suspense>
          ),
        },
        {
          path: "photos",
          element: (
            <Suspense>
              <Photos />
            </Suspense>
          ),
        },
        {
          path: "notifications",
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notification />
            </Suspense>
          ),
        },
        {
          path: "profile/:username",
          element: (
            <Suspense>
              <Profile />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "*",
      element: (
        <Suspense>
          <Error />
        </Suspense>
      ),
    },
  ]);

  return elements;
};
