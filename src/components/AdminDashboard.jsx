import { useEffect, useState } from "react";
import { MessageSquare, ShieldCheck, Users } from "lucide-react";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "../auth";

const AdminDashboard = ({ user, onStartChat }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadUsers = async () => {
            setIsLoading(true);
            setError("");

            try {
                const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
                if (!token) {
                    throw new Error("Admin session is missing. Please sign in again.");
                }

                const response = await fetch(`${API_BASE_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Could not load registered accounts."
                    );
                }
                if (!Array.isArray(data)) {
                    throw new Error("The server returned an invalid user list.");
                }

                setUsers(data);
            } catch (requestError) {
                if (requestError.name === "AbortError") return;
                console.error("Could not load admin dashboard data:", requestError);
                setError(requestError.message);
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        loadUsers();
        return () => controller.abort();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-300">
                    Administrator workspace
                </p>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Admin Dashboard
                </h2>
                <p className="mt-2 max-w-2xl leading-6 text-gray-400">
                    Welcome, {user?.name || "Administrator"}. Review Celestia
                    account activity or open the chat workspace.
                </p>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-gray-700 bg-gray-800 p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300">
                            <Users className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-sm text-gray-400">
                                Registered accounts
                            </p>
                            <p className="text-2xl font-bold text-white">
                                {isLoading ? "—" : users.length}
                            </p>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl border border-gray-700 bg-gray-800 p-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-300">
                            <ShieldCheck className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-sm text-gray-400">
                                Signed in as
                            </p>
                            <p className="text-lg font-bold capitalize text-white">
                                {user?.role || "admin"}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <section className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
                <div className="border-b border-gray-700 px-5 py-4">
                    <h3 className="font-semibold text-white">
                        Registered accounts
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                        Account profile information only; credentials are never
                        shown here.
                    </p>
                </div>

                {error ? (
                    <p className="px-5 py-6 text-sm text-red-300" role="alert">
                        {error}
                    </p>
                ) : isLoading ? (
                    <p
                        className="px-5 py-6 text-sm text-gray-400"
                        role="status"
                    >
                        Loading registered accounts...
                    </p>
                ) : users.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-gray-400">
                        No accounts found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[34rem] text-left text-sm">
                            <thead className="bg-gray-900/60 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Name
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Role
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((account) => (
                                    <tr key={account.id}>
                                        <td className="px-5 py-3 text-white">
                                            {account.name}
                                        </td>
                                        <td className="px-5 py-3 text-gray-300">
                                            {account.email}
                                        </td>
                                        <td className="px-5 py-3 capitalize text-gray-300">
                                            {account.role}
                                        </td>
                                        <td className="px-5 py-3 text-gray-400">
                                            {account.createdAt
                                                ? new Date(
                                                      account.createdAt
                                                  ).toLocaleDateString()
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <button
                type="button"
                onClick={onStartChat}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
                <MessageSquare className="h-4 w-4" />
                Open chat workspace
            </button>
        </div>
    );
};

export default AdminDashboard;
