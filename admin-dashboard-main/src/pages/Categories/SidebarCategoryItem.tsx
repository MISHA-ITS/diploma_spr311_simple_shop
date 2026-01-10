// import { useState } from "react";
// import {CategoryNode} from "./types.ts";
// import { NavLink } from "react-router-dom";
//
// interface Props {
//     category: CategoryNode;
//     level: number;
// }
//
// const SidebarCategoryItem: React.FC<Props> = ({ category, level }) => {
//     const [open, setOpen] = useState(false);
//     const hasChildren = category.children.length > 0;
//
//     return (
//         <li>
//             <div
//                 //qu
//                 className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
//                 style={{ paddingLeft: 12 + level * 16 }}>
//                 {hasChildren && (
//                     <button onClick={() => setOpen(v => !v)} className="text-xs text-slate-500">
//                         {open ? "▾" : "▸"}
//                     </button>
//                 )}
//
//                 <NavLink
//                     to={`/admin/categories/${category.urlSlug}`}
//                     className="flex-1 text-sm"
//                 >
//                     {category.name}
//                 </NavLink>
//             </div>
//
//             {open && hasChildren && (
//                 <ul>
//                     {category.children.map(child => (
//                         <SidebarCategoryItem
//                             key={child.id}
//                             category={child}
//                             level={level + 1}
//                         />
//                     ))}
//                 </ul>
//             )}
//         </li>
//     );
// };
//
// export default SidebarCategoryItem;
