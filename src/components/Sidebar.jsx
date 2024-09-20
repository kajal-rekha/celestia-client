import {
    MessageSquare,
    FileCode2,
    BarChart2,
    Settings,
    HelpCircle,
    LogOut,
    X,
    Bell,
    Sparkles
} from "lucide-react";

const Sidebar = ({
    isLoggedIn,
    onLogout,
    isOpen,
    onClose,
    onLoginClick,
    onSignupClick
}) => {
    return (
        <div
            className={`fixed inset-y-0 left-0 transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } w-64 bg-gray-800 p-4 transition-transform duration-300 ease-in-out z-20 md:relative md:translate-x-0`}
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-2 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold">Quirkle</span>
                </div>

                <button onClick={onClose} className="md:hidden">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    <li className="bg-gray-700 rounded-lg">
                        <a
                            href="#"
                            className="flex items-center p-2 text-indigo-400"
                        >
                            <MessageSquare className="w-5 h-5 mr-3" />
                            AI Chat Helper
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2">
                            <FileCode2 className="w-5 h-5 mr-3" />
                            Templates
                            <span className="ml-auto text-xs bg-indigo-600 px-2 py-1 rounded">
                                Pro
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2">
                            <BarChart2 className="w-5 h-5 mr-3" />
                            Statistics
                            <span className="ml-auto text-xs bg-indigo-600 px-2 py-1 rounded">
                                Pro
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2">
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2">
                            <Bell className="w-5 h-5 mr-3" />
                            Noticications
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2">
                            <HelpCircle className="w-5 h-5 mr-3" />
                            Updates & FAQ
                        </a>
                    </li>
                </ul>
            </nav>

            {!isLoggedIn && (
                <div className="mt-4 flex flex-col gap-3 items-center w-full overflow-hidden">
                    <button
                        onClick={onLoginClick}
                        className="px-24 py-2 bg-indigo-600 rounded-md text-md w-full"
                    >
                        Login
                    </button>
                    <button
                        onClick={onSignupClick}
                        className="px-20 py-2 bg-gray-700 rounded-md text-md  w-full "
                    >
                        Sign Up
                    </button>
                </div>
            )}

            <div className="mt-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4">
                    <h3 className="font-bold mb-2">Pro Plan</h3>
                    <p className="text-sm mb-4">
                        Strengthen artificial intelligence: get plan!
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">$10 / mo</span>
                        <button className="px-4 py-1 bg-white text-indigo-600 rounded-md text-sm font-medium">
                            Get PRO
                        </button>
                    </div>
                </div>
            </div>

            {isLoggedIn && (
                <div className=" mt-5">
                    <button
                        onClick={onLogout}
                        className="flex items-center p-2 text-gray-300 hover:text-white font-semibold"
                    >
                        <LogOut className="w-5 h-5 mr-3 text-red-500" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
