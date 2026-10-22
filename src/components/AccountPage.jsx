import { useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    LockKeyhole,
    LogIn,
    LogOut,
    UserRound,
    UserRoundPlus
} from "lucide-react";
import {
    API_BASE_URL,
    clearAuthSession,
    saveAuthSession
} from "../auth";

const inputClass =
    "mt-1 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

const AccountPage = ({ user, onStartChat, onAuthenticated, onSignOut }) => {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");
        setIsSubmitting(true);

        try {
            const isSignup = mode === "signup";
            const response = await fetch(
                `${API_BASE_URL}/users/auth/${isSignup ? "register" : "login"}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...(isSignup ? { name: name.trim() } : {}),
                        email: email.trim(),
                        password
                    })
                }
            );

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error(
                    "The account service returned an invalid response. Verify that the latest Celestia server is deployed."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.error || "Could not authenticate. Please try again."
                );
            }

            saveAuthSession(data.token, data.user);
            const authenticatedUser = {
                name: data.user.name,
                email: data.user.email,
                role: data.user.role || "user"
            };
            onAuthenticated(authenticatedUser);
            setPassword("");
            setNotice(
                isSignup
                    ? "Your account was created and you are now signed in."
                    : "You are now signed in."
            );
        } catch (requestError) {
            console.error("Account authentication failed:", requestError);
            setError(
                requestError instanceof TypeError
                    ? "Could not reach the Celestia server. Check the server deployment, database connection, and CORS configuration, then try again."
                    : requestError.message ||
                          "Could not connect to the account service. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignOut = () => {
        try {
            clearAuthSession();
            onSignOut();
            setMode("login");
            setPassword("");
            setNotice("You have been signed out.");
            setError("");
        } catch (signOutError) {
            console.error("Could not sign out:", signOutError);
            setError("Could not clear the saved session from this browser.");
        }
    };

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setError("");
        setNotice("");
        setPassword("");
    };

    return (
        <div>
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-300">
                    Profile
                </p>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Account
                </h2>
                <p className="mt-2 max-w-2xl leading-6 text-gray-400">
                    Sign in or create an account to use your Celestia profile.
                </p>
            </div>

            <section className="max-w-2xl rounded-xl border border-gray-700 bg-gray-800 p-5 sm:p-6">
                {user ? (
                    <>
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-300">
                                <UserRound className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="truncate font-semibold text-white">
                                    {user.name}
                                </h3>
                                <p className="truncate text-sm text-gray-400">
                                    {user.email}
                                </p>
                            </div>
                            <span className="ml-auto shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                Signed in
                            </span>
                        </div>
                        <div className="my-5 border-t border-gray-700" />
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                            <p className="text-sm leading-5 text-gray-400">
                                Your account is connected. New conversations
                                are saved to your account and can be opened
                                from other devices after signing in.
                            </p>
                        </div>
                        {notice && (
                            <p
                                className="mt-4 text-sm text-emerald-300"
                                role="status"
                            >
                                {notice}
                            </p>
                        )}
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={onStartChat}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
                            >
                                Back to chat
                                <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2.5 font-medium text-gray-200 hover:bg-gray-700"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                        {error && (
                            <p className="mt-4 text-sm text-red-300" role="alert">
                                {error}
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300">
                                {mode === "login" ? (
                                    <LogIn className="h-5 w-5" />
                                ) : (
                                    <UserRoundPlus className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">
                                    {mode === "login"
                                        ? "Sign in to Celestia"
                                        : "Create your account"}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {mode === "login"
                                        ? "Use your email and password."
                                        : "Join Celestia with your email."}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === "signup" && (
                                <div>
                                    <label
                                        htmlFor="account-name"
                                        className="text-sm font-medium text-gray-200"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="account-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        className={inputClass}
                                        minLength={1}
                                        maxLength={100}
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label
                                    htmlFor="account-email"
                                    className="text-sm font-medium text-gray-200"
                                >
                                    Email
                                </label>
                                <input
                                    id="account-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="account-password"
                                    className="text-sm font-medium text-gray-200"
                                >
                                    Password
                                </label>
                                <input
                                    id="account-password"
                                    name="password"
                                    type="password"
                                    autoComplete={
                                        mode === "login"
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    className={inputClass}
                                    minLength={mode === "signup" ? 8 : undefined}
                                    pattern={
                                        mode === "signup"
                                            ? "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}"
                                            : undefined
                                    }
                                    title={
                                        mode === "signup"
                                            ? "Use at least 8 characters with uppercase, lowercase, a number, and a symbol."
                                            : undefined
                                    }
                                    required
                                />
                                {mode === "signup" && (
                                    <p className="mt-1.5 text-xs text-gray-400">
                                        Use 8+ characters with uppercase,
                                        lowercase, a number, and a symbol.
                                    </p>
                                )}
                            </div>

                            {error && (
                                <p className="text-sm text-red-300" role="alert">
                                    {error}
                                </p>
                            )}
                            {notice && (
                                <p
                                    className="text-sm text-emerald-300"
                                    role="status"
                                >
                                    {notice}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    "Please wait..."
                                ) : mode === "login" ? (
                                    <>
                                        <LockKeyhole className="h-4 w-4" />
                                        Sign in
                                    </>
                                ) : (
                                    <>
                                        <UserRoundPlus className="h-4 w-4" />
                                        Create account
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-5 text-center text-sm text-gray-400">
                            {mode === "login"
                                ? "New to Celestia?"
                                : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    switchMode(
                                        mode === "login" ? "signup" : "login"
                                    )
                                }
                                className="font-medium text-indigo-300 hover:text-indigo-200"
                            >
                                {mode === "login" ? "Create account" : "Sign in"}
                            </button>
                        </p>
                        <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                            Your account session is saved in this browser.
                            After signing in, conversations are saved to your
                            account; guest conversations stay in this browser.
                        </p>
                    </>
                )}
            </section>
        </div>
    );
};

export default AccountPage;
