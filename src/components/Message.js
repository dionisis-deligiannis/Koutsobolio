import React,{useRef , useEffect} from 'react'
import moment from 'moment'

function Message({msg, user1}) {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    },[msg])
  return (
    <div className={`message_wrapper ${msg.from === user1? "own":"" }` } ref={scrollRef} >
        <p className={msg.from === user1? "me" : "friend"}>
            {msg.text}
            <br/>
            <small>
                {moment(msg.createdAt.toDate()).fromNow()}
            </small>
        </p>
    </div>
  )
}

export default Message