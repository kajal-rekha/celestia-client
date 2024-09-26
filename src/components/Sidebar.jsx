import {
    FileCode2,
    BarChart2,
    Settings,
    HelpCircle,
    X,
    Bell,
    Sparkles,
    User,
    LifeBuoy,
    Link
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <div
            className={`fixed inset-y-0 left-0 transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } w-64 bg-gray-800 p-4 transition-transform duration-300 ease-in-out z-20 lg:relative lg:translate-x-0`}
        >
            <div className="flex items-center justify-between mb-5 border-b border-gray-700 ">
                <div className="flex items-center mb-5 ">
                    <a
                        href="/"
                        className="w-8 h-8 bg-indigo-600 rounded-lg mr-2 flex items-center justify-center"
                    >
                        <Sparkles className="w-5 h-5" />
                    </a>
                    <a href="/" className="text-xl font-bold">
                        Quirkle
                    </a>
                </div>

                <button onClick={onClose} className="lg:hidden">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <a href="/template" className="flex items-center p-2">
                            <FileCode2 className="w-5 h-5 mr-3" />
                            Templates
                            <span className="ml-auto text-xs bg-indigo-600 px-2 py-1 rounded">
                                Pro
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="/statistics" className="flex items-center p-2">
                            <BarChart2 className="w-5 h-5 mr-3" />
                            Statistics
                            <span className="ml-auto text-xs bg-indigo-600 px-2 py-1 rounded">
                                Pro
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="/settings" className="flex items-center p-2">
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                        </a>
                    </li>
                    <li>
                        <a
                            href="/notifications"
                            className="flex items-center p-2"
                        >
                            <Bell className="w-5 h-5 mr-3" />
                            Notifications
                        </a>
                    </li>
                    <li>
                        <a href="/faq" className="flex items-center p-2">
                            <HelpCircle className="w-5 h-5 mr-3" />
                            Updates & FAQ
                        </a>
                    </li>
                    <li>
                        <a href="/support" className="flex items-center p-2">
                            <LifeBuoy className="w-5 h-5 mr-3" />
                            Support
                        </a>
                    </li>
                    <li>
                        <a
                            href="/integrations"
                            className="flex items-center p-2"
                        >
                            <Link className="w-5 h-5 mr-3" />
                            Integrations
                        </a>
                    </li>
                    <li>
                        <a href="/account" className="flex items-center p-2">
                            <User className="w-5 h-5 mr-3" />
                            Account
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="mt-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4">
                    <h3 className="font-bold mb-2">Premium Plan</h3>
                    <p className="text-sm mb-4">
                        Unlock advanced features: elevate your experience!
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">$15 / mo</span>
                        <button className="px-4 py-1 bg-white text-indigo-600 rounded-md text-sm font-medium">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
