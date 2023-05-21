
import { notificationItems } from './../../services/utils/static.data';
// notificationItems ->[{ index: 0, title: "Direct Messages", description: "New direct messages notifications.",
//                     toggle: true,type: "messages"}]

import { Utils } from './../../services/utils/utils.service';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from './../button/Button';
import './NotificationSettings.scss';
import Toggle from '../toggle/Toggle';
import { userService } from './../../services/api/user/user.service';
import { updateUserProfile } from '../../redux-toolkit/reducers/user/user.reducer';

const NotificationSettings = () => {
  let { profile } = useSelector((state) => state.user);
  const [notificationTypes, setNotificationTypes] = useState([]);
  //eg.notificationTypes ->   [{ index: 0, title: "Direct Messages", 
  //   description: "New direct messages notifications.",toggle: true,type: "messages"}]
  let [notificationSettings, setNotificationSettings] = useState(profile?.notifications);
  //eg.notificationSettings->{messages: true, reactions: true, comments: true, follows: true}

  const dispatch = useDispatch();

  console.log("profile notifaction",profile.notifications);
  // taking notification data from utils and changes its toggle property based on users profile
  // notifiaction toggle. 
  const mapNotificationTypesToggle = useCallback(
    (notifications) => {
      console.log("mapping notifiaction type with db realted toggled value->",notifications)
      for (const notification of notifications) {
        const toggled = notificationSettings[notification.type];
        notification.toggle = toggled;
      }
      setNotificationTypes(notifications);
    },
    [notificationSettings]
  );

  // change the toggle property of notification specific item 
  const updateNotificationTypesToggle = (itemIndex) => {
    const updatedData = notificationTypes.map((item, index) => {
      if (index === itemIndex) {
        return {
          ...item,
          toggle: !item.toggle
        };
      }
      return item;
    });
    setNotificationTypes(updatedData);
  };

  // update db 
  const sendNotificationSettings = async () => {
    console.log("UPDATING db with ",notificationSettings)
    try {
      const response = await userService.updateNotificationSettings(notificationSettings);
      // dispatch event to update redux store with the updated notification settings
      profile = cloneDeep(profile);
      profile.notifications = response.data.settings;
      dispatch(updateUserProfile(profile));
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    mapNotificationTypesToggle(notificationItems);
  }, [notificationTypes, mapNotificationTypesToggle]);

  useEffect(() => {
     console.log("notificationTypes updated Display::::::",notificationTypes)
     console.log("notificationSettings updated DB::::::",notificationSettings)
  }, [notificationTypes,notificationSettings]);


  return (
    <>
      <div className="notification-settings">
        {notificationTypes.map((data, index) => (
          <div
            className="notification-settings-container"
            key={Utils.generateString(10)}
            data-testid="notification-settings-item"
          >
            <div className="notification-settings-container-sub-card">
              <div className="notification-settings-container-sub-card-body">
                <h6 className="title">{`${data.title}`}</h6>
                <div className="subtitle-body">
                  <p className="subtext">{data.description}</p>
                </div>
              </div>
              <div className="toggle" data-testid="toggle-container">
                <Toggle
                  toggle={data.toggle}
                  onClick={() => {
                    // update display related notification setting
                    updateNotificationTypesToggle(index);
                    notificationSettings = cloneDeep(notificationSettings);
                    // update db related notificationsetting
                    notificationSettings[data.type] = !notificationSettings[data.type];
                    setNotificationSettings(notificationSettings);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="btn-group">
          <Button label="Update" className="update" disabled={false} handleClick={sendNotificationSettings} />
        </div>
      </div>
      <div style={{ height: '1px' }}></div>
    </>
  );
};
export default NotificationSettings;