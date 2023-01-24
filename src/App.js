import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { UserAuthContextProvider } from './UserAuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <UserAuthContextProvider>
            <Routes>
                <Route path="/" index element={ 
                    <ProtectedRoute> 
                        <Home /> 
                    </ProtectedRoute> 
                } 
                />
                <Route path="/login" element={ <Login /> } />
                <Route path="/signup" element={ <Signup /> } />
            </Routes>
        </UserAuthContextProvider>
    );
}

export default App;
