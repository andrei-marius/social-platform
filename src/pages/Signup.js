import "../App.css";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import{ useUserAuth } from '../UserAuthContext';
import { auth } from '../Firebase';
import { updateProfile, createUserWithEmailAndPassword } from 'firebase/auth';

function Signup() {
    const navigate = useNavigate();
    const [ newUser, setNewUser ] = useState({ email: '', username: '', password: '' });
    const [ loading, setLoading ] = useState(false);
    const { user } = useUserAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        criteriaMode: "all"
    });

    useEffect(() => {
        if (user !== null) {
            navigate('/');
        }
    }, [user, navigate])

    const onSubmit = () => {
        setLoading(true);
        createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
        .then((userCredential) => {
            updateProfile(userCredential.user, {displayName: newUser.username})
            .then(() => {
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.log(error.message);
            });
        })
        .catch((error) => {
            setLoading(false);
            console.log(error.message);
        });
    }
    
    const onError = () => {
        console.log(errors);
    }

    const handleChange = ({ target: { name, value } }) => {
        setNewUser({
            ...newUser,
            [name]: value
        })
    }

    return (
        <div className='form-container'>
            <ErrorMessage
                errors={errors}
                name="email"
                render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                        <div className='error' key={type}>{message}</div>
                    ))
                }
            />
            <ErrorMessage
                errors={errors}
                name="username"
                render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                        <div className='error' key={type}>{message}</div>
                    ))
                }
            />
            <ErrorMessage
                errors={errors}
                name="password"
                render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                        <div className='error' key={type}>{message}</div>
                    ))
                }
            />
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <input 
                    type='text'
                    placeholder='Email'
                    name='email'
                    {...register("email", {
                        onChange: e => handleChange(e),
                        required: "Email required", 
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email invalid"
                        }
                    })} 
                />
                <input 
                    type='text'
                    placeholder='Username'
                    name='username'
                    {...register("username", {
                        onChange: e => handleChange(e),
                        required: "Username required", 
                        minLength: {
                            value: 1,
                            message: "Username should have at least 1 character"
                        }, 
                        maxLength: {
                            value: 100,
                            message: "Username should not have more than 100 characters"
                        }
                    })} 
                />
                <input
                    type='password'
                    placeholder='Password'
                    name='password'
                    {...register("password", {
                        onChange: e => handleChange(e),
                        required: "Password required", 
                        minLength: {
                            value: 6,
                            message: "Password should have at least 6 character"
                        },
                        maxLength: {
                            value: 100,
                            message: "Password should not have more than 100 characters"
                        }
                    })} 
                />
                <button type='submit'>{loading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'SIGN UP'}</button>
            </form>
            <div className='wrapper'>
                <Link to='/login'>LOG IN</Link>
            </div>
        </div>
    );
}

export default Signup;