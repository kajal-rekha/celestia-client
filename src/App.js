import { useState } from "react";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WorkspacePage from "./components/WorkspacePage";
import { readAuthUser } from "./auth";

const VIEW_TITLES = {
    chat: "Celestia Knowledge Companion",
    admin: "Admin Dashboard",
    dashboard: "Dashboard",
    reports: "Reports",
    settings: "Settings",
    notifications: "Notifications",
    faq: "Updates & FAQ",
    support: "Support",
    integrations: "Integrations",
    account: "Account"
};

const App = () => {
    const [initialUser] = useState(readAuthUser);
    const [currentUser, setCurrentUser] = useState(initialUser);
    const [activeView, setActiveView] = useState(() =>
        initialUser?.role === "admin" ? "admin" : "chat"
    );
    const [showSidebar, setShowSidebar] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [newChatKey, setNewChatKey] = useState(0);

    const startNewChat = () => {
        setActiveView("chat");
        setShowHistory(false);
        setNewChatKey((key) => key + 1);
    };

    const openChatHistory = () => {
        setActiveView("chat");
        setShowHistory(true);
    };

    const navigateTo = (view) => {
        if (view === "admin" && currentUser?.role !== "admin") {
            setActiveView("chat");
            setShowSidebar(false);
            return;
        }

        setActiveView(view);
        setShowSidebar(false);
        setShowHistory(false);
    };

    const handleAuthenticated = (user) => {
        setCurrentUser(user);
        setActiveView(user.role === "admin" ? "admin" : "chat");
        setShowSidebar(false);
        setShowHistory(false);
    };

    const handleSignOut = () => {
        setCurrentUser(null);
        setActiveView("chat");
        setShowSidebar(false);
        setShowHistory(false);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
            <Sidebar
                isOpen={showSidebar}
                activeView={activeView}
                userRole={currentUser?.role}
                onClose={() => setShowSidebar(false)}
                onNavigate={navigateTo}
                onNewChat={startNewChat}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    title={VIEW_TITLES[activeView]}
                    onMenuClick={() => setShowSidebar(true)}
                    onHistoryClick={openChatHistory}
                    onNewChat={startNewChat}
                    onAccountClick={() => navigateTo("account")}
                />

                <main className="flex min-h-0 flex-1">
                    {activeView === "chat" ? (
                        <ChatArea
                            newChatKey={newChatKey}
                            isHistoryOpen={showHistory}
                            onHistoryClose={() => setShowHistory(false)}
                        />
                    ) : (
                        <WorkspacePage
                            view={activeView}
                            onStartChat={startNewChat}
                            onNavigate={navigateTo}
                            user={currentUser}
                            onAuthenticated={handleAuthenticated}
                            onSignOut={handleSignOut}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
