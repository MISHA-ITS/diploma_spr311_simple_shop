import {IUserItem, IUserRowProps} from "./types.ts";
import * as React from "react";
import {Link} from "react-router-dom";
import EnvConfig from "../../config/env.ts";
import { Lock, Unlock, UserX, UserRoundPen } from "lucide-react";
import {Select} from "antd";

const urlUserImage = `${EnvConfig.API_URL}/images/users`;

const UserRow: React.FC<IUserRowProps> = ({user, initials, onDeleteUser, onToggleLock, onChangeRole}) => {
    const isLocked = (user: IUserItem) => {
        if (!user.lockoutEnd) return false;
        return new Date(user.lockoutEnd) > new Date();
    };
    const locked = isLocked(user);

    return (
        <div
             className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-4">
            <div className="flex items-center gap-3">
                <div
                    className="relative h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden grid place-items-center text-sm font-medium">
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
                    {locked && (
                        <div className="
                                  absolute inset-0 flex items-center justify-center
                                  bg-black/50 rounded-full
                                ">
                            <Lock size={26} className="text-white" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                    <div className="text-xs text-neutral-500">{user.email}</div>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                <Select className="h-9 w-21 text-xs"
                        options={[
                            { value: "Admin", label: "Admin" },
                            { value: "User", label: "User" }
                        ]}
                        value={user.roles[0] ?? ""}
                        onChange={(role) => onChangeRole(user, role)}
                />
            </div>
            <div>
                {locked && (
                    <span className="
                                    text-xs font-semibold
                                    text-red-700
                                    dark:bg-red-900 dark:text-red-200
                                ">
                                    Заблокований
                                </span>
                )}
            </div>
            <div className="mt-3 flex justify-end gap-2">
                <Link to={`/admin/user/${user.id}`}
                      className="
                              px-3 py-1.5 rounded-xl text-xs font-medium
                              flex items-center gap-1.5
                              bg-blue-800 text-white
                              hover:bg-blue-600
                              dark:bg-blue-600 dark:hover:bg-blue-600

                              transition-all duration-200
                              hover:scale-105
                              active:scale-85

                              hover:ring-2 hover:ring-blue-900
                              ring-offset-0 dark:ring-offset-neutral-900
                          "
                >
                    <UserRoundPen size={14} />
                </Link>
                <button
                    className={`
                            px-3 py-1.5 rounded-xl text-xs font-medium
                            flex items-center gap-1.5
                    
                            transition-all duration-200
                            hover:scale-105 active:scale-95
                    
                            hover:ring-2 ring-offset-0
                    
                            ${locked
                        ? `
                                  bg-green-600 text-white
                                  hover:bg-green-500
                                  hover:ring-green-900
                                  dark:bg-green-600 dark:hover:bg-green-500
                                `
                        : `
                                  bg-yellow-500 text-white
                                  hover:bg-yellow-400
                                  hover:ring-yellow-900
                                  dark:bg-yellow-500 dark:hover:bg-yellow-400
                                `
                    }
                        `}
                    onClick={() => {
                        const ok = confirm(
                            locked
                                ? "Ви впевнені, що хочете активувати користувача?"
                                : "Ви впевнені, що хочете заблокувати користувача?"
                        );

                        if (!ok) return;

                        onToggleLock(user);
                    }}
                >
                    {locked ? (
                        <>
                            <Unlock size={14} />
                        </>
                    ) : (
                        <>
                            <Lock size={14} />
                        </>
                    )}
                </button>
                <button
                    className="
                              px-3 py-1.5 rounded-xl text-xs font-medium
                              flex items-center gap-1.5
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
                    <UserX size={14} />
                </button>
            </div>
        </div>
    );
}

export default UserRow;