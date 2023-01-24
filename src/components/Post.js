import { useState, useEffect } from "react";
import { useUserAuth } from "../UserAuthContext";
import { collection, onSnapshot, deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "../Firebase";

function Post(props) {
    const { user } = useUserAuth();
    const [ likes, setLikes ] = useState([]);
    const [ hasLike, setHasLike ] = useState(false);

    useEffect(() => {
        setHasLike(likes.findIndex((like) => 
            like.id === user.uid) !== -1
        )
    }, [likes, user.uid])
    
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, 'posts', props.id, 'likes'), snapshot => {
            setLikes(snapshot.docs)
        })
        return () => {
            unsubscribe();
        }
    }, [props.id])

    const likePost = async () => {
        try {
            if (hasLike) {
                await deleteDoc(doc(firestore, 'posts', props.id, 'likes', user.uid))
            } else {
                await setDoc(doc(firestore, 'posts', props.id, 'likes', user.uid ), {
                    user: user.email
                })
            }
        } catch(err) {
            console.log(err.message);
        }
    }
    
    return (
        <div className='post-container'>
            <div className='username'>{props.username}</div>
            <div className='message'>{props.msg}</div>
            <img className='image' src={props.imgSrc} alt={props.imgSrc}></img>
            <div className="btn-container">
                <div>
                <button onClick={likePost}>{hasLike ? 'LIKED' : 'LIKE'}</button>
                {
                    likes.length > 0 && (
                        <span>{likes.length} {likes.length === 1 ? 'LIKE' : 'LIKES'}</span>
                    )
                }
                </div>
                {
                    user.uid === props.userId && (
                        <>
                            <button className="delete" onClick={props.delete}>{props.id === props.deleteLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'DELETE'}</button>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Post;