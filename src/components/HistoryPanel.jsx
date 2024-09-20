import { Trash2 } from "lucide-react";

const HistoryPanel = ({ isOpen }) => {
    const historyItems = [
        {
            title: "Create welcome form",
            description: "Write code (HTML, CSS and JS) for a simple..."
        },
        {
            title: "Instructions",
            description: "How to set up a Wi-Fi wireless network?"
        },
        {
            title: "Career",
            description: "How to organize your working day effectively?"
        },

        {
            title: "Onboarding",
            description: "How does artificial intelligence work?"
        }
    ];

    return (
        <div
            className={`fixed right-0 transform top-0 overflow-y-hidden ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } w-64 bg-gray-800 p-4 transition-transform duration-300 ease-in-out z-20 md:relative md:translate-x-0 md:w-64 md:flex md:flex-col pb-7`}
        >
            <div className="flex justify-between items-center ">
                <h2 className="text-lg font-semibold  hidden md:block ">
                    History
                </h2>
                <button className="bg-gray-900/50 py-1 px-3 rounded-lg text-[14px] font-semibold">
                    6/50
                </button>
            </div>
            <ul className=" flex-1  mt-12">
                {historyItems.map((item, index) => (
                    <li
                        key={index}
                        className={
                            index === 0
                                ? "bg-gray-700 p-2 rounded-lg"
                                : "p-2 rounded-lg"
                        }
                    >
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-400">
                            {item.description}
                        </p>
                    </li>
                ))}
                <button className="bg-gray-900  px-8 py-2 rounded-lg  mt-5 ml-5 flex gap-3 items-center mt-40">
                    <Trash2 className="w-5 h-5 hover:text-red-500 duration-300" />
                    Clear history
                </button>
            </ul>
        </div>
    );
};
export default HistoryPanel;
