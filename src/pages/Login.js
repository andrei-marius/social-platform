import "../App.css";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from "../UserAuthContext";

function Login() {
    const navigate = useNavigate();
    let [ loggingInUser, setLoggingInUser ] = useState({ email: '', password: '' });
    const [ loading, setLoading ] = useState(false);
    const { user, logIn } = useUserAuth();

    useEffect(() => {
        if (user !== null) {
            navigate('/');
        }
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await logIn(loggingInUser.email, loggingInUser.password);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    const handleChange = ({ target: { name, value } }) => {
        setLoggingInUser({
            ...loggingInUser,
            [name]: value
        })
    }

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Email' name='email' onChange={handleChange} />
                <input type='password' placeholder='Password' name='password' onChange={handleChange} />
                <button type='submit'>{loading ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'LOG IN'}</button>
            </form>
            <div className='wrapper'>
                <Link to='/signup'>SIGN UP</Link>
            </div>
        </div>
    );
}

export default Login;