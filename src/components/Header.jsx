import { Search, Menu, Clock } from "lucide-react";

const Header = ({ onMenuClick, onHistoryClick }) => {
    return (
        <header className="flex items-center justify-between p-5 border-b border-gray-700 gap-5 ">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="mr-4 lg:hidden">
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">AI Chat Helper</h1>
            </div>
            <div className="flex items-center space-x-8">
                <div className="relative hidden lg:block">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-10 pr-3 py-2 bg-gray-800 rounded-md w-48 lg:w-64 focus:outline-none border border-gray-500 focus:border-gray-400"
                    />
                </div>
                <button onClick={onHistoryClick} className="lg:hidden block">
                    <Clock className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;
