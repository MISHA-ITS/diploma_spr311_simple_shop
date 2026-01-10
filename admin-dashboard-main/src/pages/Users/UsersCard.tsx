import {Props} from "./types.ts";

const UsersCard: React.FC<Props> = ({ count, children }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/10 dark:border-white/10">
            <h2 className="text-lg font-semibold">Користувачі</h2>
            <div className="text-sm text-neutral-500">{count} запис(ів)</div>
        </div>
        {children}
    </div>
);

export default UsersCard;
