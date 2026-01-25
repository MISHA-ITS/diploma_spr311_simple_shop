import type {IUserRowProps} from "./types.ts";
import * as React from "react";
import {Link} from "react-router-dom";
import EnvConfig from "../../config/env.ts";

const urlUserImage = `${EnvConfig.API_URL}/images`;

const UserRow: React.FC<IUserRowProps> = ({user, initials, onDeleteUser}) => {
    return (
        <div
             className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-4">
            <div className="flex items-center gap-3">
                <div
                    className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden grid place-items-center text-sm font-medium">
                    {user.image ? (
                        <img
                            className="h-full w-full object-cover"
                            src={`${urlUserImage}/50_${user.image}`}
                            alt={user.firstName}
                            onError={(e) => {
                                e.currentTarget.src = `${urlUserImage}/noimage.jpeg`;
                            }}
                        />
                    ) : (
                        <span>{initials(`${user.firstName} ${user.lastName}`)}</span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                    <div className="text-xs text-neutral-500">{user.email}</div>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {user.roles.map((r, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10"
                    >
                                        {r}
                                    </span>
                ))}
            </div>
            <div className="mt-3 flex justify-end gap-2">
                <Link to={`/user/${user.id}`}
                      className="
                              px-3 py-1.5 rounded-xl text-xs font-medium
                              bg-blue-800 text-white
                              hover:bg-blue-600
                              dark:bg-blue-600 dark:hover:bg-blue-600

                              transition-all duration-200
                              hover:scale-105
                              active:scale-85

                              hover:ring-2 hover:ring-blue-900
                              ring-offset-0 dark:ring-offset-neutral-900
                          "
                      onClick={() => alert(`Edit user ${user.id}`)}
                >
                    Редагувати
                </Link>
                <button
                    className="
                              px-3 py-1.5 rounded-xl text-xs font-small
                              bg-yellow-500 text-white
                              hover:bg-yellow-400
                              dark:bg-yellow-500 dark:hover:bg-yellow-400

                              transition-all duration-200
                              hover:scale-105
                              active:scale-85

                              hover:ring-2 hover:ring-yellow-900
                              ring-offset-0 dark:ring-offset-yellow-900
                          "
                    onClick={() => {
                        if (confirm("Ви впевнені, що хочете заблокувати користувача?")) {
                            alert(`Block user ${user.id}`)
                        }
                    }}
                >
                    Заблокувати
                </button>
                <button
                    className="
                              px-3 py-1.5 rounded-xl text-xs font-medium
                              bg-red-800 text-white
                              hover:bg-red-600
                              dark:bg-red-600 dark:hover:bg-red-600

                              transition-all duration-200
                              hover:scale-105
                              active:scale-85

                              hover:ring-2 hover:ring-red-900
                              ring-offset-0 dark:ring-offset-neutral-900
                          "
                    onClick={() => onDeleteUser(user.id)}
                >
                    Видалити
                </button>
            </div>
        </div>
    );
}

export default UserRow;