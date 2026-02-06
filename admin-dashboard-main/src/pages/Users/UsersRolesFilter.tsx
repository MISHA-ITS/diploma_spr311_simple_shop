const AVAILABLE_ROLES = ["Admin", "User"];

interface Props {
    roles: string[];
    onChange: (roles: string[]) => void;
}

const UsersRolesFilter: React.FC<Props> = ({ roles, onChange }) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {AVAILABLE_ROLES.map(role => {
                const active = roles.includes(role);

                return (
                    <button
                        key={role}
                        onClick={() =>
                            onChange(
                                active
                                    ? roles.filter(r => r !== role)
                                    : [...roles, role]
                            )
                        }
                        className={`px-3 py-1 rounded-full text-sm border transition
                            ${
                            active
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-transparent border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {role}
                    </button>
                );
            })}
        </div>
    );
};

export default UsersRolesFilter;
