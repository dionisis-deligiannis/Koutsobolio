import React, { useEffect, useState } from "react";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import { db, auth } from "../firebase";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([]);
  const user1 = auth.currentUser.uid;

  //   useEffect( () => () => {
  //     async function handleOffline() {
  //       await updateDoc(doc(db, "users", auth.currentUser.uid), {
  //         isOnline: false,
  //       });

  //     }
  //     handleOffline()
  // }, [] );

  //   // useEffect( () => {
  //   //   async function handleOnline() {
  //   //     await updateDoc(doc(db, "users", auth.currentUser.uid), {
  //   //       isOnline: true,
  //   //     });

  //   //   }
  //   //   handleOnline()
  //   // }, [] );

  useEffect(() => {

    const usersRef = collection(db, "users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [user1]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      setUsers([]);
      querySnapshot.forEach((doc) => {
        setUsers((current) => [...current, doc.data()]);
      });
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectUser = async (user) => {
    setChat(user);
    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
    // get last message from logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    if (docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
    });
    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });
    setText("");
  };

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="message_container">
        {chat ? (
          <>
            <div className="messages_user">
              <h3> {chat.name}</h3>
            </div>
            <div className="messages">
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} />
                  ))
                : null}
            </div>
            <div>
              <MessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
              />
            </div>
          </>
        ) : (
          <h3 className="no_cov">Select a user to start conversation</h3>
        )}
      </div>
    </div>
  );
}
