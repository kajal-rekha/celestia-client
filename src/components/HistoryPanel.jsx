import { Clock, MessageSquare, Trash2, X } from "lucide-react";

const HistoryPanel = ({
    history = [],
    activeConversationId,
    isOpen,
    onClose,
    onSelect,
    clearHistory
}) => {
    return (
        <div
            className={`${
                isOpen
                    ? "fixed inset-0 z-50 flex justify-end bg-black/60 lg:static lg:bg-transparent"
                    : "hidden lg:flex"
            }`}
        >
            <aside
                role={isOpen ? "dialog" : undefined}
                aria-modal={isOpen ? "true" : undefined}
                aria-label="Chat history"
                className="flex h-full w-[min(20rem,88vw)] flex-col border-l border-gray-700 bg-gray-800 px-3 lg:w-64 lg:shrink-0"
            >
                <div className="flex items-center justify-between border-b border-gray-700 p-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            History
                        </h2>
                        <p className="text-xs text-gray-400">
                            Recent conversations
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-gray-900/50 px-2.5 py-1 text-sm font-semibold text-white">
                            {history.length}/50
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white lg:hidden"
                            aria-label="Close chat history"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="history-list min-h-0 flex-1 overflow-y-auto py-3">
                    {history.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                            <Clock className="mb-3 h-8 w-8 text-gray-500" />
                            <p className="font-medium text-gray-200">
                                No conversations yet
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                Your chats will appear here after you get a
                                reply.
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {history.map((conversation) => (
                                <li key={conversation.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(conversation.id)}
                                        aria-current={
                                            activeConversationId ===
                                            conversation.id
                                                ? "true"
                                                : undefined
                                        }
                                        className={`w-full rounded-lg p-3 text-left transition-colors ${
                                            activeConversationId ===
                                            conversation.id
                                                ? "bg-gray-700"
                                                : "hover:bg-gray-700/70"
                                        }`}
                                    >
                                        <span className="flex items-start gap-2">
                                            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
                                            <span className="min-w-0">
                                                <span className="block truncate font-medium text-white">
                                                    {conversation.title}
                                                </span>
                                                <span className="mt-1 block truncate text-sm text-gray-400">
                                                    {conversation.preview}
                                                </span>
                                                <time
                                                    className="mt-1 block text-xs text-gray-500"
                                                    dateTime={
                                                        conversation.updatedAt
                                                    }
                                                >
                                                    {new Date(
                                                        conversation.updatedAt
                                                    ).toLocaleString()}
                                                </time>
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="border-t border-gray-700 py-3">
                    <button
                        type="button"
                        onClick={clearHistory}
                        className="flex w-full items-center justify-center rounded bg-gray-900 px-3 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={history.length === 0}
                    >
                        <Trash2 className="mr-2 h-5 w-5" />
                        Clear history
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default HistoryPanel;
