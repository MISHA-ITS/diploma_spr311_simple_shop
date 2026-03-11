import { useState } from "react";
import UserRow from "./UserRow";
import UserRowMobile from "./UserRowMobile";
import UsersCard from "./UsersCard";
import Pagination from "./Pagination";

import {
    useGetAllListQuery,
    useDeleteUserMutation,
    useLockUserMutation,
    useUnlockUserMutation,
    useUpdateUserMutation
} from "../../services/apiUser";

import { IUserItem } from "./types";
import UsersLockedFilter from "./UsersLockedFilter.tsx";
import UsersSearch from "./UsersSearch.tsx";
import UsersRolesFilter from "./UsersRolesFilter.tsx";

const UsersList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);

    const [filters, setFilters] = useState<{
        search: string;
        isLocked?: boolean;
        roles: string[];
    }>({
        search: "",
        isLocked: undefined,
        roles: []
    });

    const { data } = useGetAllListQuery({
        pageNumber: page,
        pageSize,
        search: filters.search || undefined,
        isLocked: filters.isLocked,
        roles: filters.roles.length ? filters.roles : undefined
    });

    const users = data?.payload.items ?? [];
    const total = data?.payload.total ?? 0;

    const [deleteUser] = useDeleteUserMutation();
    const [lockUser] = useLockUserMutation();
    const [unlockUser] = useUnlockUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const handleToggleLock = async (user: IUserItem) => {
        const isLocked =
            user.lockoutEnd && new Date(user.lockoutEnd) > new Date();

        try {
            if (isLocked) {
                await unlockUser(user.id).unwrap();
            } else {
                await lockUser(user.id).unwrap();
            }

            alert(
                `Користувача ${
                    user.fullName ?? `${user.firstName} ${user.lastName}`
                } ${isLocked ? "розблоковано" : "заблоковано"}`
            );
        } catch {
            alert("Помилка при зміні статусу");
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Видалити користувача?")) return;
        try {
            await deleteUser(id).unwrap();
        } catch {
            alert("Помилка при видаленні");
        }
    };

    const handleChangeRole = async (user: IUserItem, role: string) => {

        const ok = confirm(`Змінити роль користувача на ${role}?`);
        if (!ok) return;

        try {

            await updateUser({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                roles: [role],
                imageFile: null
            }).unwrap();

        } catch {
            alert("Помилка зміни ролі");
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
                <UsersCard count={total}>
                    <table className="min-w-full text-left align-middle text-neutral-700 dark:text-neutral-200">
                        <thead className="bg-neutral-200 dark:bg-neutral-700 text-xs uppercase text-center">
                        <tr>
                            <th className="px-5 py-3">ID</th>

                            <th className="px-5 py-3">
                                <UsersLockedFilter
                                    value={filters.isLocked}
                                    onChange={value => {
                                        setPage(1);
                                        setFilters(p => ({ ...p, isLocked: value }));
                                    }}
                                />
                            </th>

                            <th className="px-5 py-3">
                                <UsersSearch
                                    value={filters.search}
                                    onChange={value => {
                                        setPage(1);
                                        setFilters(p => ({ ...p, search: value }));
                                    }}
                                    onClear={() => {
                                        setPage(1);
                                        setFilters(p => ({ ...p, search: "" }));
                                    }}
                                />
                            </th>

                            <th className="px-5 py-3">
                                <UsersRolesFilter
                                    roles={filters.roles}
                                    onChange={roles => {
                                        setPage(1);
                                        setFilters(p => ({ ...p, roles }));
                                    }}
                                />
                            </th>

                            <th className="px-5 py-3">Дії</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-black/5 dark:divide-white/10">
                        {users.map(u => (
                            <UserRow
                                key={u.id}
                                user={u}
                                initials={() =>
                                    `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`
                                }
                                onDeleteUser={handleDeleteUser}
                                onToggleLock={handleToggleLock}
                                onChangeRole={handleChangeRole}
                            />
                        ))}
                        </tbody>
                    </table>
                </UsersCard>
            </div>

            {/* MOBILE */}
            <div className="md:hidden">
                <UsersCard count={total}>
                    {users.map(u => (
                        <UserRowMobile
                            key={u.id}
                            user={u}
                            initials={() =>
                                `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`
                            }
                            onDeleteUser={handleDeleteUser}
                            onToggleLock={handleToggleLock}
                            onChangeRole={handleChangeRole}
                        />
                    ))}
                </UsersCard>
            </div>

            <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
            />
        </div>
    );
};

export default UsersList;
