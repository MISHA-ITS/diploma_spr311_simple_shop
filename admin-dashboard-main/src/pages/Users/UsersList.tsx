import {useEffect, useState} from "react";
import axios from "axios";
import {IUserItem} from "./types.ts";
import UserRow from "./UserRow.tsx";
import EnvConfig from "../../config/env.ts";
import UserRowMobile from "./UserRowMobile.tsx";
import UsersCard from "./UsersCard.tsx";

const UsersList : React.FC = () => {

    const urlUsers = `${EnvConfig.API_URL}/api/User/GetAll/List`;
    const urlUsersImages = `${EnvConfig.API_URL}/images/users`;

    const [users, setUsers] = useState<IUserItem[]>([])

    useEffect(() => {
        axios.get(urlUsers)
            .then(resp => {
                console.log("API DATA:", resp.data);
                setUsers(resp.data.payload);
            })
            .catch(error => {
                console.log("axios error", error);
            })
        console.log("Working useEffect", urlUsers);
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            console.log(`${urlUsersImages}/50_${users[0].image}`);
        }
    }, [users]);

    const handleDeleteUser = async (userId: number) => {
        if (!confirm("Ви впевнені, що хочете видалити користувача?")) return;

        try {
            const res = await fetch(`${EnvConfig.API_URL}/api/User/Delete?id=${userId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const text = await res.text();
                alert("Помилка: " + text);
                return;
            }

            alert("Користувача успішно видалено");

            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            console.error(err);
            alert("Помилка при видаленні користувача");
        }
    };

    return (
        <>
            <div className="w-full">

                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <UsersCard count={users.length}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left align-middle">
                                <thead className="bg-neutral-50 dark:bg-neutral-500 text-xs text-center uppercase">
                                <tr>
                                    <th className="px-5 py-3">ID</th>
                                    <th className="px-5 py-3">Користувач</th>
                                    <th className="px-5 py-3">Електронна адреса</th>
                                    <th className="px-5 py-3">Ролі</th>
                                    <th className="px-5 py-3">Дії</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                {users.map(u => (
                                    <UserRow
                                        key={u.id}
                                        user={u}
                                        initials={() => u.firstName[0] + u.lastName[0]}
                                        onDeleteUser={handleDeleteUser} // <-- передаємо callback
                                    />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </UsersCard>
                </div>

                {/* Mobile */}
                <div className="md:hidden mt-4">
                    <UsersCard count={users.length}>
                        <table className="min-w-full">
                            <tbody className="divide-y divide-black/5 dark:divide-white/10">
                            {users.map(u => (
                                <UserRowMobile
                                    key={u.id}
                                    user={u}
                                    initials={() => u.firstName[0] + u.lastName[0]}
                                    onDeleteUser={handleDeleteUser} // <-- передаємо callback
                                />
                            ))}
                            </tbody>
                        </table>
                    </UsersCard>
                </div>
            </div>
        </>
    )
}

export default UsersList;