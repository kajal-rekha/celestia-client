import { useState } from "react";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <Sidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
                className="fixed top-0 left-0 w-64 h-full bg-gray-800"
            />

            <div className="flex-1 flex flex-row w-full ">
                <div className="flex-1 flex flex-col w-full">
                    <div>
                        <Header
                            onMenuClick={() => setShowSidebar(true)}
                            className="fixed top-0 left-64 right-64 bg-gray-900 h-16 z-30 border-b border-gray-700"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pt-16 ">
                        <ChatArea />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
