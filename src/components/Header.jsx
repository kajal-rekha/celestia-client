import { Clock, Menu, MessageSquarePlus, User } from "lucide-react";

const Header = ({
    title,
    onMenuClick,
    onHistoryClick,
    onNewChat,
    onAccountClick
}) => {
    return (
        <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-gray-700 bg-gray-900 px-4 sm:px-6">
            <div className="flex min-w-0 items-center">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="mr-3 rounded p-1 text-gray-300 hover:bg-gray-800 lg:hidden"
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="truncate text-base font-bold sm:text-xl">
                    {title}
                </h1>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    onClick={onNewChat}
                    className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                    aria-label="Start a new chat"
                    title="New chat"
                >
                    <MessageSquarePlus className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={onAccountClick}
                    className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                    aria-label="Open account"
                    title="Account"
                >
                    <User className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={onHistoryClick}
                    className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white lg:hidden"
                    aria-label="View chat history"
                    title="Chat history"
                >
                    <Clock className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
