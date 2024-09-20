import { useState } from "react";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import HistoryPanel from "./components/HistoryPanel";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import SignUp from "./components/SignUp";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true); // Sidebar always shown
    const [showHistory, setShowHistory] = useState(true); // History always shown

    const handleLogin = (username, password) => {
        console.log("Logging in with:", username, password);
        setIsLoggedIn(true);
        setShowLogin(false);
    };

    const handleSignup = (username, email, password) => {
        console.log("Signing up with:", username, email, password);
        setIsLoggedIn(true);
        setShowSignup(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <Sidebar
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                isOpen={showSidebar}
                onLoginClick={() => setShowLogin(true)}
                onSignupClick={() => setShowSignup(true)}
                onClose={() => setShowSidebar(false)}
                className="fixed top-0 left-0 w-64 h-full bg-gray-800"
            />

            <div className="flex-1 flex flex-row w-full ">
                <div className="flex-1 flex flex-col w-full">
                    <Header
                        onMenuClick={() => setShowSidebar(true)}
                        onHistoryClick={() => setShowHistory(true)}
                        className="fixed top-0 left-64 right-64 bg-gray-900 h-16 z-10 border-b border-gray-700"
                    />

                    <div className="flex-1 overflow-y-auto pt-16 ">
                        <ChatArea />
                    </div>
                </div>

                {showHistory && (
                    <div className="w-64 h-full bg-gray-800 hidden md:block">
                        <HistoryPanel
                            className="fixed top-0 right-0 w-64 h-full bg-gray-800 z-20"
                            onClose={() => setShowHistory(false)}
                        />
                    </div>
                )}
            </div>

            {showLogin && (
                <Login
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
                />
            )}

            {showSignup && (
                <SignUp
                    onClose={() => setShowSignup(false)}
                    onSignup={handleSignup}
                />
            )}
        </div>
    );
};

export default App;
