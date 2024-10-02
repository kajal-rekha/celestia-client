import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, PaperclipIcon } from "lucide-react";
import HistoryPanel from "./HistoryPanel";

const ChatArea = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [history, setHistory] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newUserMessage = { role: "user", content: input };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInput("");

        try {
            const response = await fetch(
                "https://celestia-server-sepia.vercel.app/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ message: input })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();
            const newAiMessage = { role: "ai", content: data.response };
            setMessages((prevMessages) => [...prevMessages, newAiMessage]);

            setHistory((prevHistory) => [
                {
                    title: input,
                    description: (data.response || "").substring(0, 50) + "..."
                },
                ...(prevHistory || []).slice(0, 49)
            ]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = {
                role: "ai",
                content:
                    "Sorry, something went wrong while processing your request. Please try again later."
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleVoiceInput = () => {
        console.log("Voice input not implemented");
        setIsListening((prev) => !prev);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="flex h-screen bg-gray-900 relative -mt-16 max-h-[76.5vh] mb-3">
            <div className="flex-1 flex flex-col lg:pr-64">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
                    {messages.map((message, i) => (
                        <div
                            key={i}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[75%] p-3 rounded-lg ${
                                    message.role === "user"
                                        ? "bg-indigo-600"
                                        : "bg-gray-700"
                                }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="fixed bottom-0 left-0 lg:right-64 bg-gray-900 border-t border-gray-700 p-4 w-full">
                    <div className="max-w-2xl lg:max-w-xl xl:max-w-3xl 2xl:max-w-5xl mx-auto relative lg:ml-[17.5rem]">
                        <div className="flex items-center bg-gray-700 rounded-lg shadow-xl">
                            <button className="p-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <PaperclipIcon className="w-5 h-5" />
                            </button>

                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={
                                    isListening
                                        ? "Listening..."
                                        : "Type your message..."
                                }
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 p-3 max-h-32 h-full resize-none focus:outline-none"
                                rows={1}
                                disabled={isListening}
                            />
                            <button
                                onClick={handleVoiceInput}
                                className={`p-3 transition-colors ${
                                    isListening
                                        ? "bg-red-500 rounded-full"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <Mic
                                    className={`w-6 h-6 ${
                                        isListening ? "text-white" : ""
                                    }`}
                                />
                            </button>
                            <button
                                onClick={handleSend}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg transition-colors p-3 focus:outline-none"
                                aria-label="Send message"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <HistoryPanel history={history} clearHistory={clearHistory} />
        </div>
    );
};

export default ChatArea;
