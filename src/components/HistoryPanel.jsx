import React from "react";
import { Trash2 } from "lucide-react";

const HistoryPanel = ({ history = [], clearHistory }) => {
    return (
        <div className="fixed top-0 right-0 w-64 bg-gray-800 lg:flex flex-col bottom-0 px-3 hidden  overflow-hidden">
            <div className="p-4 border-b border-gray-700 ">
                <div className="flex justify-between items-center mb-[7px]">
                    <h2 className="text-lg font-semibold text-white">
                        History
                    </h2>
                    <span className="bg-gray-900/50 py-1 px-3 rounded-lg text-[14px] font-semibold text-white">
                        {history.length || 0}/50
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 history-list max-h-[76vh] mt-1">
                <ul className="space-y-4">
                    {(history || []).map((item, index) => (
                        <li
                            key={index}
                            className={`p-2 rounded-lg ${
                                index === 0 ? "bg-gray-700" : ""
                            }`}
                        >
                            <h3 className="font-medium text-white">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className=" border-t border-gray-700 fixed bottom-6 px-3 py-2 ">
                <button
                    onClick={clearHistory}
                    className="bg-gray-900 hover:bg-red-700 text-white font-bold py-2 px-10  rounded flex items-center justify-center transition-colors duration-300  w-full "
                    disabled={history.length === 0}
                >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Clear history
                </button>
            </div>
        </div>
    );
};

export default HistoryPanel;
