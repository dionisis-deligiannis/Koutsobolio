import React, { useEffect, useState } from "react";
import Img from "../images/user-profile-icon.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

function User({ user1, user, selectUser, chat }) {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img src={user.avatar || Img} alt="avatar" className="avatar" />
            <h4>{user.name}</h4>
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {data && (
          <p className="truncate">
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
            <strong>{data.from === user1 ? "Me:" : null}</strong>
            {data.text}
          </p>
        )}
      </div>
      <div onClick={() => selectUser(user)} className="sm_container">
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
    </>
  );
}

export default User;
