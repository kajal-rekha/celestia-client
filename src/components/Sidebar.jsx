import {
    Bell,
    FileText,
    Grid,
    HelpCircle,
    LifeBuoy,
    Link,
    MessageSquare,
    Settings,
    Sparkles,
    ShieldCheck,
    User,
    X
} from "lucide-react";

const NAV_ITEMS = [
    { id: "chat", label: "New chat", icon: MessageSquare },
    { id: "dashboard", label: "Dashboard", icon: Grid },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "faq", label: "Updates & FAQ", icon: HelpCircle },
    { id: "support", label: "Support", icon: LifeBuoy },
    { id: "integrations", label: "Integrations", icon: Link },
    { id: "account", label: "Account", icon: User }
];

const Sidebar = ({
    isOpen,
    activeView,
    userRole,
    onClose,
    onNavigate,
    onNewChat
}) => {
    const navigationItems =
        userRole === "admin"
            ? [
                  { id: "admin", label: "Admin Dashboard", icon: ShieldCheck },
                  ...NAV_ITEMS
              ]
            : NAV_ITEMS;

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gray-800 p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="mb-5 flex items-center justify-between border-b border-gray-700 pb-4">
                    <button
                        type="button"
                        onClick={onNewChat}
                        className="flex items-center gap-2 text-left"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                            <Sparkles className="h-5 w-5" />
                        </span>
                        <span className="text-xl font-bold">Celestia</span>
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white lg:hidden"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto" aria-label="Main navigation">
                    <ul className="space-y-1">
                        {navigationItems.map(({ id, label, icon: Icon }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        id === "chat"
                                            ? onNewChat()
                                            : onNavigate(id)
                                    }
                                    aria-current={
                                        activeView === id ? "page" : undefined
                                    }
                                    className={`flex w-full items-center rounded-lg p-2 text-left transition-colors ${
                                        activeView === id
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-200 hover:bg-gray-700"
                                    }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    <h2 className="mb-2 font-bold">
                        {userRole === "admin"
                            ? "Administrator"
                            : "Knowledge workspace"}
                    </h2>
                    <p className="mb-3 text-sm text-indigo-50">
                        {userRole === "admin"
                            ? "Manage the Celestia workspace."
                            : "Sign in to save conversations to your account."}
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            onNavigate(
                                userRole === "admin" ? "admin" : "account"
                            )
                        }
                        className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                        {userRole === "admin"
                            ? "Admin dashboard"
                            : "Account details"}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
