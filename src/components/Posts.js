import { useState, useEffect } from "react";
import Post from "./Post";
import { onSnapshot, query, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { firestore } from "../Firebase";

export default function Posts() {
    const [ posts, setPosts ] = useState([]);
    const [ loading, setLoading ] = useState(undefined);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(firestore, 'posts')), snapshot => {
            let data = [];
            snapshot.docs.forEach(doc => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setPosts(data);
        })
        return () => {
            unsubscribe();
        }    
    }, [])

    const deletePost = async id => {
        setLoading(id);
        try {
            await deleteDoc(doc(firestore, 'posts', id));
            const querySnapshot = await getDocs(collection(firestore, 'posts', id, 'likes'));
            querySnapshot.forEach(document => {
                deleteDoc(doc(firestore, 'posts', id, 'likes', document.id));
            });
        } catch(err) {
            console.log(err.message);
        }
        setLoading(undefined);
    }

    return (
        <div className='posts-container'>
            {posts.map(post => {
                return <Post
                    key={post.id}
                    id={post.id}
                    username={post.username}
                    msg={post.message}
                    imgSrc={post.image}
                    delete={() => deletePost(post.id)}
                    userId={post.userId}
                    deleteLoading={loading}
                /> 
            })}
        </div>
    )
}