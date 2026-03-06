import {FC} from "react";
import {IAdvertisement} from "../Advertisement/types.ts";
import AdvCard from "./AdvCard.tsx";

type AdvRowProps = {
    advertisements: IAdvertisement[];
    viewMode: 'grid' | 'list';
}

const AdvRow: FC<AdvRowProps> = ({advertisements, viewMode}) => {
    return (
        <div className="flex flex-row items-center gap-2 w-[1438px] h-[345px] flex-none self-stretch">
            {advertisements.map((ad) => (
                <AdvCard key={ad.id} advertisement={ad} viewMode={viewMode} />
            ))}
        </div>
    )
}

export default AdvRow;