import {IUserItem, IUserRowProps} from "./types.ts";
import * as React from "react";
import {Link} from "react-router-dom";
import EnvConfig from "../../config/env.ts";
import { Lock, UserCheck, UserX, UserRoundPen, UserLock } from "lucide-react";
import {Select} from "antd";

const urlUserImage = `${EnvConfig.API_URL}/images/users`;

const UserRow: React.FC<IUserRowProps> = ({user, initials, onDeleteUser, onToggleLock, onChangeRole}) => {
    const isLocked = (user: IUserItem) => {
        if (!user.lockoutEnd) return false;
        return new Date(user.lockoutEnd) > new Date();
    };
    const locked = isLocked(user);

    return (
        <tr key={user.id} className="hover:bg-neutral-50/80 dark:hover:bg-white/5">

            <td className="px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">{user.id}</td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="relative h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden grid place-items-center text-sm font-medium">
                        {user.image ? (
                            // If you store only file names, swap to your CDN/base path below
                            <img
                                className="h-full w-full object-cover"
                                src={user.image.startsWith("http") ? user.image : `${urlUserImage}/50_${user.image}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                onError={(e) => {
                                // graceful fallback to initials if image fails
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                }}
                            />
                        ) : (
                            <span>{initials(`${user.firstName}, ${user.lastName}`)}</span>
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
                    <div>
                        <div className="font-medium leading-tight text-neutral-700 dark:text-neutral-200">
                            {`${user.firstName} ${user.lastName}`}
                        </div>
                        <div className="text-xs text-neutral-500">
                            #{String(user.id).padStart(4, "0")}
                        </div>
                        <div>
                            {locked && (
                                <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                                    Заблокований
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4 text-sm text-neutral-700 dark:text-neutral-200">{user.email}</td>

            <td className="px-5 py-4 w-[190px]">
                <Select className="h-9 w-21 text-xs"
                    options={[
                        { value: "Admin", label: "Admin" },
                        { value: "User", label: "User" }
                    ]}
                    value={user.roles[0] ?? ""}
                    onChange={(role) => onChangeRole(user, role)}
                />
            </td>

            <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
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
                        Редагувати
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
                            // const ok = confirm(
                            //     locked
                            //         ? "Ви впевнені, що хочете активувати користувача?"
                            //         : "Ви впевнені, що хочете заблокувати користувача?"
                            // );
                            //
                            // if (!ok) return;

                            onToggleLock(user);
                        }}
                    >
                        {locked ? (
                            <>
                                <UserCheck size={14} />
                                Активувати
                            </>
                        ) : (
                            <>
                                <UserLock size={14} />
                                Блокувати
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
                        Видалити
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default React.memo(UserRow);