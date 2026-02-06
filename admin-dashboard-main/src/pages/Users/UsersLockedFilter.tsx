interface Props {
    value?: boolean;
    onChange: (value?: boolean) => void;
}

const UsersLockedFilter: React.FC<Props> = ({ value, onChange }) => {
    return (
        <select
            value={
                value === undefined
                    ? "all"
                    : value
                        ? "locked"
                        : "active"
            }
            onChange={e => {
                const v = e.target.value;
                onChange(
                    v === "all" ? undefined : v === "locked"
                );
            }}
            className="text-xs border rounded px-2 py-1 bg-white dark:bg-neutral-800"
        >
            <option value="all">Усі</option>
            <option value="locked">Заблоковані</option>
            <option value="active">Активні</option>
        </select>
    );
};

export default UsersLockedFilter;
