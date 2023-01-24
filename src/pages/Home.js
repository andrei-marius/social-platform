import { useState } from 'react';
import { useUserAuth } from "../UserAuthContext";
import Posts from '../components/Posts';
import { storage, firestore } from '../Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

function Home() {
    const { user, logOut } = useUserAuth();
    const [ msg, setMsg ] = useState('');
    const [ img, setImg ] = useState(undefined);
    const [ loading, setLoading ] = useState(false);
    const [ imgAdded, setImgAdded ] = useState(false);
     
    const handleLogOut = async () => {
        try {
            await logOut();
        } catch(err) {
            console.log(err.message);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (imgAdded) {
            setLoading(true);
            const imageRef = ref(storage, `${img.name}`);
            uploadBytes(imageRef, img)
            .then(() => {
                getDownloadURL(imageRef)
                .then((url) => {
                    addDoc(collection(firestore, 'posts'), {
                        userId: user.uid,
                        username: user.displayName,
                        message: msg,
                        image: url
                    })
                    e.target.reset();
                    setLoading(false);
                    setImgAdded(false);
                    setImg(null);
                    setMsg('');
                }).catch(error => {
                    console.log(error.message);
                    setLoading(false);
                    setImgAdded(false);
                    setImg(null);
                    setMsg('');
                })
            }).catch(error => {
                console.log(error.message);
                setLoading(false);
                setImgAdded(false);
                setImg(null);
            })
        }
        
        if (!imgAdded && msg.length > 0) {
            setLoading(true);
            addDoc(collection(firestore, 'posts'), {
                userId: user.uid,
                username: user.displayName,
                message: msg
            })
            e.target.reset();
            setLoading(false);
            setMsg('');
        }
    }

    const handleImage = e => {
        if (e.target.files[0] && e.target.files[0].type.indexOf('image') >= -1) {
            setImg(e.target.files[0]);
            setImgAdded(true);
        } else {
            console.log('no img')
            setImgAdded(false);
        }
    }
    
    const handleChange = e => {
        setMsg(e.target.value);
    }

    return (
        <>
            <div className='header'>
                <div>SP</div>
                <button onClick={handleLogOut}>LOG OUT</button>
            </div>
            <div className='middle'>
                <form className='post-form' onSubmit={handleSubmit}>
                    <textarea onChange={handleChange} placeholder='Type...' />
                    <input type="file" id="upload" hidden onChange={handleImage}/>
                    <button type='submit'>{loading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'POST'}</button>
                </form>
                <label className='add-image' htmlFor="upload">{imgAdded ? 'ADDED' : 'ADD IMAGE'}</label>
                <Posts />
            </div>
        </>
    );
}

export default Home;