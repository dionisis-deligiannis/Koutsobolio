import React, { useEffect, useState } from "react";
import User from "../components/User";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Home() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const usersRef = collection(db, "users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUsers((current) => [...current, doc.data()]);
      });
    });
    return () => unsub();
  }, []);
  
  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}
