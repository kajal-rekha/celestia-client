import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import {
    API_BASE_URL,
    AUTH_EVENT_NAME,
    AUTH_TOKEN_KEY
} from "../auth";
import HistoryPanel from "./HistoryPanel";

const STORAGE_KEY = "celestia-chat-conversations-v1";
const LEGACY_HISTORY_KEY = "celestia-chat-history";
const CONVERSATION_LIMIT = 50;
const EMPTY_MESSAGES = [];

const createId = () =>
    window.crypto?.randomUUID?.() ||
    `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const loadConversations = () => {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) {
                throw new Error("Saved conversations must be an array.");
            }

            return parsed
                .filter(
                    (conversation) =>
                        conversation &&
                        typeof conversation.id === "string" &&
                        Array.isArray(conversation.messages)
                )
                .map((conversation) => ({
                    ...conversation,
                    messages: conversation.messages.filter(
                        (message) =>
                            message &&
                            (message.role === "user" ||
                                message.role === "ai") &&
                            typeof message.content === "string"
                    )
                }))
                .sort(
                    (first, second) =>
                        new Date(second.updatedAt).getTime() -
                        new Date(first.updatedAt).getTime()
                )
                .slice(0, CONVERSATION_LIMIT);
        }

        const oldHistory = window.localStorage.getItem(LEGACY_HISTORY_KEY);
        if (!oldHistory) return [];

        const parsedHistory = JSON.parse(oldHistory);
        if (!Array.isArray(parsedHistory)) {
            throw new Error("Saved chat history must be an array.");
        }

        return parsedHistory
            .filter((item) => item && typeof item.title === "string")
            .slice(0, CONVERSATION_LIMIT)
            .map((item, index) => {
                const updatedAt = new Date(
                    Date.now() - index * 1000
                ).toISOString();
                const messages = [
                    { role: "user", content: item.title },
                    ...(typeof item.description === "string"
                        ? [
                              {
                                  role: "ai",
                                  content: item.description.replace(/\.\.\.$/, "")
                              }
                          ]
                        : [])
                ];
                return {
                    id: createId(),
                    title: item.title,
                    updatedAt,
                    messages
                };
            });
    } catch (error) {
        console.error("Could not load saved Celestia conversations:", error);
        return [];
    }
};

const makeConversationSummary = (conversation) => {
    const firstUserMessage = conversation.messages.find(
        (message) => message.role === "user"
    );
    const latestMessage = conversation.messages[conversation.messages.length - 1];
    const title = firstUserMessage?.content?.trim() || "New conversation";

    return {
        id: conversation.id,
        title: title.length > 42 ? `${title.slice(0, 42)}...` : title,
        preview:
            latestMessage?.content?.replace(/\s+/g, " ").slice(0, 64) || "",
        updatedAt: conversation.updatedAt
    };
};

const ChatArea = ({ newChatKey, isHistoryOpen, onHistoryClose }) => {
    const getStoredAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);
    const [authToken, setAuthToken] = useState(getStoredAuthToken);
    const [workspace, setWorkspace] = useState(() => {
        const conversations = authToken ? [] : loadConversations();
        return {
            conversations,
            activeConversationId:
                newChatKey === 0 ? conversations[0]?.id || null : null
        };
    });
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(Boolean(authToken));
    const [syncError, setSyncError] = useState("");
    const messagesEndRef = useRef(null);
    const workspaceRef = useRef(workspace);
    const sendingRef = useRef(false);
    const lastNewChatKey = useRef(newChatKey);

    useEffect(() => {
        const handleAuthChange = () => {
            setAuthToken(getStoredAuthToken());
        };

        handleAuthChange();
        window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
        return () => {
            window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
        };
    }, []);

    useEffect(() => {
        const nextConversations = authToken ? [] : loadConversations();
        const nextWorkspace = {
            conversations: nextConversations,
            activeConversationId:
                newChatKey === 0 ? nextConversations[0]?.id || null : null
        };

        workspaceRef.current = nextWorkspace;
        setWorkspace(nextWorkspace);
    }, [authToken, newChatKey]);

    const activeConversation = workspace.conversations.find(
        (conversation) => conversation.id === workspace.activeConversationId
    );
    const messages = activeConversation?.messages || EMPTY_MESSAGES;
    const history = workspace.conversations.map(makeConversationSummary);

    const updateWorkspace = (nextWorkspace) => {
        workspaceRef.current = nextWorkspace;
        setWorkspace(nextWorkspace);
    };

    useEffect(() => {
        if (authToken) return;
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(workspace.conversations)
            );
        } catch (error) {
            console.error("Could not save Celestia conversations:", error);
        }
    }, [authToken, workspace.conversations]);

    useEffect(() => {
        if (!authToken) {
            setIsHistoryLoading(false);
            return undefined;
        }

        let isCurrent = true;
        const loadServerHistory = async () => {
            setIsHistoryLoading(true);
            setSyncError("");

            try {
                const response = await fetch(`${API_BASE_URL}/conversations`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Could not load account chat history."
                    );
                }
                if (!Array.isArray(data)) {
                    throw new Error("The server returned invalid chat history.");
                }

                const conversations = data
                    .filter(
                        (conversation) =>
                            conversation &&
                            typeof conversation.id === "string" &&
                            Array.isArray(conversation.messages)
                    )
                    .slice(0, CONVERSATION_LIMIT);

                if (isCurrent) {
                    const nextWorkspace = {
                        conversations,
                        activeConversationId: conversations[0]?.id || null
                    };
                    workspaceRef.current = nextWorkspace;
                    setWorkspace(nextWorkspace);
                }
            } catch (error) {
                console.error("Could not load server chat history:", error);
                if (isCurrent) {
                    setSyncError(
                        `${error.message} Your account history could not be synced.`
                    );
                }
            } finally {
                if (isCurrent) setIsHistoryLoading(false);
            }
        };

        loadServerHistory();
        return () => {
            isCurrent = false;
        };
    }, [authToken]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (lastNewChatKey.current !== newChatKey) {
            lastNewChatKey.current = newChatKey;
            const nextWorkspace = {
                ...workspaceRef.current,
                activeConversationId: null
            };
            workspaceRef.current = nextWorkspace;
            setWorkspace(nextWorkspace);
            setInput("");
            onHistoryClose();
        }
    }, [newChatKey, onHistoryClose]);

    const appendMessage = (conversationId, message) => {
        const current = workspaceRef.current;
        const existing = current.conversations.find(
            (conversation) => conversation.id === conversationId
        );
        const updatedConversation = {
            id: conversationId,
            title: existing?.title || message.content,
            updatedAt: new Date().toISOString(),
            messages: [...(existing?.messages || []), message]
        };
        const conversations = [
            updatedConversation,
            ...current.conversations.filter(
                (conversation) => conversation.id !== conversationId
            )
        ].slice(0, CONVERSATION_LIMIT);

        updateWorkspace({
            conversations,
            activeConversationId: conversationId
        });

        if (!authToken) return;

        return fetch(
            `${API_BASE_URL}/conversations/${encodeURIComponent(conversationId)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    messages: updatedConversation.messages
                })
            }
        )
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error || "Could not save account chat history."
                    );
                }
            })
            .then(() => setSyncError(""))
            .catch((error) => {
                console.error("Could not save server chat history:", error);
                setSyncError(
                    `${error.message} This conversation may not be saved to your account.`
                );
            });
    };

    const handleSend = async () => {
        const prompt = input.trim();
        if (!prompt || sendingRef.current || isHistoryLoading) return;

        sendingRef.current = true;
        setIsSending(true);
        setInput("");

        const conversationId =
            workspace.activeConversationId &&
            workspace.conversations.some(
                (conversation) =>
                    conversation.id === workspace.activeConversationId
            )
                ? workspace.activeConversationId
                : createId();

        await appendMessage(conversationId, { role: "user", content: prompt });

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(authToken
                        ? { Authorization: `Bearer ${authToken}` }
                        : {})
                },
                body: JSON.stringify({ message: prompt })
            });

            if (!response.ok) {
                throw new Error(
                    `Chat request failed with status ${response.status}.`
                );
            }

            const data = await response.json();
            if (typeof data.response !== "string" || !data.response.trim()) {
                throw new Error("The chat service returned an empty response.");
            }

            await appendMessage(conversationId, {
                role: "ai",
                content: data.response
            });
        } catch (error) {
            console.error("Could not get a chat response:", error);
            await appendMessage(conversationId, {
                role: "ai",
                content:
                    "Sorry, I couldn't get a response. Please check your connection and try again."
            });
        } finally {
            sendingRef.current = false;
            setIsSending(false);
        }
    };

    const selectConversation = (conversationId) => {
        updateWorkspace({
            ...workspaceRef.current,
            activeConversationId: conversationId
        });
        onHistoryClose();
    };

    const clearHistory = async () => {
        if (authToken) {
            try {
                const response = await fetch(`${API_BASE_URL}/conversations`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Could not clear account chat history."
                    );
                }
            } catch (error) {
                console.error("Could not clear server chat history:", error);
                setSyncError(error.message);
                return;
            }
        }

        updateWorkspace({
            conversations: [],
            activeConversationId: null
        });
        setSyncError("");
        onHistoryClose();
    };

    return (
        <div className="relative flex min-h-0 min-w-0 flex-1">
            <section className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div
                    className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
                    aria-live="polite"
                >
                    {syncError && (
                        <div
                            className="mx-auto mb-4 max-w-3xl rounded-lg border border-amber-700 bg-amber-950/50 px-4 py-3 text-sm text-amber-200"
                            role="alert"
                        >
                            {syncError}
                        </div>
                    )}
                    {isHistoryLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            Loading your saved conversations...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-300">
                                <Send className="h-7 w-7" />
                            </div>
                            <h2 className="text-2xl font-semibold text-white">
                                What would you like to know?
                            </h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                                Ask Celestia a question to start a conversation.
                                {authToken
                                    ? " Your chats are saved to your account and can be reopened from History."
                                    : " Your guest chats are saved in this browser and can be reopened from History."}
                            </p>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-3xl space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={`${workspace.activeConversationId}-${index}`}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 leading-6 sm:max-w-[80%] ${
                                            message.role === "user"
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-800 text-gray-100"
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {isSending && (
                                <div
                                    className="flex justify-start"
                                    role="status"
                                    aria-label="Celestia is responding"
                                >
                                    <div className="rounded-2xl bg-gray-800 px-4 py-3 text-sm text-gray-300">
                                        Celestia is thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="shrink-0 border-t border-gray-700 bg-gray-900 p-3 sm:p-4">
                    <div className="mx-auto max-w-3xl">
                        <div className="flex items-end rounded-xl bg-gray-800 shadow-lg ring-1 ring-gray-700 focus-within:ring-indigo-500">
                            <textarea
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        !event.shiftKey
                                    ) {
                                        event.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Type your message..."
                                aria-label="Type your message"
                                className="max-h-40 min-h-12 flex-1 resize-y bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                                rows={1}
                                disabled={isSending || isHistoryLoading}
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={
                                    !input.trim() ||
                                    isSending ||
                                    isHistoryLoading
                                }
                                className="m-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Send message"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <HistoryPanel
                history={history}
                activeConversationId={workspace.activeConversationId}
                isOpen={isHistoryOpen}
                onClose={onHistoryClose}
                onSelect={selectConversation}
                clearHistory={clearHistory}
            />
        </div>
    );
};

export default ChatArea;
