import {
    ArrowRight,
    Bell,
    CircleHelp,
    FileText,
    Link,
    MessageSquare,
    Settings,
    ShieldCheck
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import AccountPage from "./AccountPage";

const panelClass =
    "rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6";

const PageHeading = ({ eyebrow, title, description }) => (
    <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-300">
            {eyebrow}
        </p>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl leading-6 text-gray-400">{description}</p>
    </div>
);

const ActionButton = ({ children, onClick, icon: Icon = ArrowRight }) => (
    <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700"
    >
        {children}
        <Icon className="h-4 w-4" />
    </button>
);

const DashboardPage = ({ onStartChat, onNavigate }) => (
    <div>
        <PageHeading
            eyebrow="Your workspace"
            title="Welcome to Celestia"
            description="Ask questions, revisit recent conversations, and manage your knowledge workspace from one place."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <button
                type="button"
                onClick={onStartChat}
                className={`${panelClass} text-left transition-colors hover:border-indigo-500`}
            >
                <MessageSquare className="mb-4 h-6 w-6 text-indigo-300" />
                <h3 className="font-semibold text-white">Start a conversation</h3>
                <p className="mt-2 text-sm leading-5 text-gray-400">
                    Ask Celestia a question and continue where you left off
                    using chat history.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-300">
                    Open chat <ArrowRight className="h-4 w-4" />
                </span>
            </button>
            <button
                type="button"
                onClick={() => onNavigate("reports")}
                className={`${panelClass} text-left transition-colors hover:border-indigo-500`}
            >
                <FileText className="mb-4 h-6 w-6 text-indigo-300" />
                <h3 className="font-semibold text-white">Reports</h3>
                <p className="mt-2 text-sm leading-5 text-gray-400">
                    Review the current reporting capabilities and saved
                    conversations.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-300">
                    View reports <ArrowRight className="h-4 w-4" />
                </span>
            </button>
            <button
                type="button"
                onClick={() => onNavigate("settings")}
                className={`${panelClass} text-left transition-colors hover:border-indigo-500`}
            >
                <Settings className="mb-4 h-6 w-6 text-indigo-300" />
                <h3 className="font-semibold text-white">Workspace settings</h3>
                <p className="mt-2 text-sm leading-5 text-gray-400">
                    Learn how chat data is stored and manage this browser
                    workspace.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-300">
                    Open settings <ArrowRight className="h-4 w-4" />
                </span>
            </button>
        </div>
        <div className={`${panelClass} mt-6 flex items-start gap-3`}>
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
                <h3 className="font-semibold text-white">Your chats, your browser</h3>
                <p className="mt-1 text-sm leading-5 text-gray-400">
                    Guest conversations are saved locally. Sign in to save new
                    conversations to your account and access them on another
                    device.
                </p>
            </div>
        </div>
    </div>
);

const ReportsPage = ({ onStartChat }) => (
    <div>
        <PageHeading
            eyebrow="Insights"
            title="Reports"
            description="A clear view of the reporting tools currently available in your Celestia workspace."
        />
        <section className={`${panelClass} max-w-3xl`}>
            <FileText className="mb-4 h-8 w-8 text-indigo-300" />
            <h3 className="text-lg font-semibold text-white">
                Conversation reports are not available yet
            </h3>
            <p className="mt-2 leading-6 text-gray-400">
                You can revisit full conversations from History. Exportable
                reports and analytics need a reporting service, which is not
                connected in this version.
            </p>
            <div className="mt-5">
                <ActionButton onClick={onStartChat} icon={MessageSquare}>
                    Start a conversation
                </ActionButton>
            </div>
        </section>
    </div>
);

const SettingsPage = ({ onNavigate }) => (
    <div>
        <PageHeading
            eyebrow="Preferences"
            title="Settings"
            description="Understand how this workspace behaves and where your chat data is kept."
        />
        <div className="max-w-3xl space-y-4">
            <section className={panelClass}>
                <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                        <h3 className="font-semibold text-white">
                            Conversation storage
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-gray-400">
                            Guest chat history is stored in this browser.
                            Signed-in conversations are saved in the Celestia
                            server database and are available wherever you sign
                            in.
                        </p>
                    </div>
                </div>
            </section>
            <section className={panelClass}>
                <div className="flex gap-3">
                    <Settings className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
                    <div>
                        <h3 className="font-semibold text-white">Appearance</h3>
                        <p className="mt-1 text-sm leading-5 text-gray-400">
                            Celestia currently uses its dark workspace theme.
                            Theme switching is not available yet.
                        </p>
                    </div>
                </div>
            </section>
            <section className={panelClass}>
                <h3 className="font-semibold text-white">Account preferences</h3>
                <p className="mt-1 text-sm leading-5 text-gray-400">
                    Sign in or create an account here to save new conversations
                    to the server and access them across devices.
                </p>
                <button
                    type="button"
                    onClick={() => onNavigate("account")}
                    className="mt-4 text-sm font-medium text-indigo-300 hover:text-indigo-200"
                >
                    View account status
                </button>
            </section>
        </div>
    </div>
);

const NotificationsPage = () => (
    <div>
        <PageHeading
            eyebrow="Updates"
            title="Notifications"
            description="Important workspace updates and alerts will be shown here."
        />
        <section className={`${panelClass} max-w-3xl`}>
            <Bell className="mb-4 h-8 w-8 text-indigo-300" />
            <h3 className="font-semibold text-white">You're all caught up</h3>
            <p className="mt-2 text-sm leading-5 text-gray-400">
                There are no notifications right now. Push and email
                notifications are not configured for this workspace.
            </p>
        </section>
    </div>
);

const FaqPage = () => (
    <div>
        <PageHeading
            eyebrow="Help center"
            title="Updates & FAQ"
            description="Answers to common questions about using Celestia."
        />
        <div className="max-w-3xl space-y-3">
            <details className={panelClass}>
                <summary className="cursor-pointer font-semibold text-white">
                    How do I start a chat?
                </summary>
                <p className="mt-3 leading-6 text-gray-400">
                    Choose New chat from the sidebar or header, type your
                    question in the message box, then press Enter or select the
                    send button.
                </p>
            </details>
            <details className={panelClass}>
                <summary className="cursor-pointer font-semibold text-white">
                    Where are my conversations saved?
                </summary>
                <p className="mt-3 leading-6 text-gray-400">
                    Guest conversations are saved in this browser. When signed
                    in, conversations are saved to your account on the server.
                </p>
            </details>
            <details className={panelClass}>
                <summary className="cursor-pointer font-semibold text-white">
                    How do I reopen an old conversation?
                </summary>
                <p className="mt-3 leading-6 text-gray-400">
                    Open History and select a conversation. On a phone, use the
                    clock icon in the header to open History.
                </p>
            </details>
            <details className={panelClass}>
                <summary className="cursor-pointer font-semibold text-white">
                    Can I attach files or use voice input?
                </summary>
                <p className="mt-3 leading-6 text-gray-400">
                    File attachments and voice input are not available yet.
                </p>
            </details>
        </div>
    </div>
);

const SupportPage = ({ onNavigate }) => (
    <div>
        <PageHeading
            eyebrow="We're here to help"
            title="Support"
            description="Find help with chat, saved conversations, or the current workspace features."
        />
        <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
            <section className={panelClass}>
                <CircleHelp className="mb-4 h-6 w-6 text-indigo-300" />
                <h3 className="font-semibold text-white">Common questions</h3>
                <p className="mt-2 text-sm leading-5 text-gray-400">
                    Read how chat and browser-based history work.
                </p>
                <button
                    type="button"
                    onClick={() => onNavigate("faq")}
                    className="mt-4 text-sm font-medium text-indigo-300 hover:text-indigo-200"
                >
                    Open Updates & FAQ
                </button>
            </section>
            <section className={panelClass}>
                <MessageSquare className="mb-4 h-6 w-6 text-indigo-300" />
                <h3 className="font-semibold text-white">Contact support</h3>
                <p className="mt-2 text-sm leading-5 text-gray-400">
                    Ticket submission is not connected yet. No support request
                    will be sent from this page.
                </p>
            </section>
        </div>
    </div>
);

const IntegrationsPage = () => (
    <div>
        <PageHeading
            eyebrow="Connected services"
            title="Integrations"
            description="Connect Celestia to the tools and knowledge sources you use."
        />
        <section className={`${panelClass} max-w-3xl`}>
            <Link className="mb-4 h-8 w-8 text-indigo-300" />
            <h3 className="font-semibold text-white">
                No integrations connected
            </h3>
            <p className="mt-2 leading-6 text-gray-400">
                External integrations are not configured in this version. No
                external service has access to your conversations.
            </p>
        </section>
    </div>
);

const WorkspacePage = ({
    view,
    user,
    onStartChat,
    onNavigate,
    onAuthenticated,
    onSignOut
}) => {
    const pages = {
        admin: (
            <AdminDashboard user={user} onStartChat={onStartChat} />
        ),
        dashboard: (
            <DashboardPage onStartChat={onStartChat} onNavigate={onNavigate} />
        ),
        reports: <ReportsPage onStartChat={onStartChat} />,
        settings: <SettingsPage onNavigate={onNavigate} />,
        notifications: <NotificationsPage />,
        faq: <FaqPage />,
        support: <SupportPage onNavigate={onNavigate} />,
        integrations: <IntegrationsPage />,
        account: (
            <AccountPage
                user={user}
                onStartChat={onStartChat}
                onAuthenticated={onAuthenticated}
                onSignOut={onSignOut}
            />
        )
    };

    return (
        <div className="w-full overflow-y-auto px-4 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">{pages[view]}</div>
        </div>
    );
};

export default WorkspacePage;
