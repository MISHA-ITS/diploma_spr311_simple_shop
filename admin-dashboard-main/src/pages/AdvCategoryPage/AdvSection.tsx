import {FC} from "react";
import {IAdvertisement} from "../Advertisement/types.ts";
import AdvRow from "./AdvRow.tsx";
import AdvCard from "./AdvCard.tsx";

type AdvSectionProps = {
    viewMode: 'grid' | 'list';
    advertisements: IAdvertisement[];
}

const AdvSection: FC<AdvSectionProps> = ({viewMode, advertisements}) => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 0,
        gap: viewMode === 'grid' ? 25 : 12,
        width: viewMode === 'grid' ? 1438 : 1428,
        maxHeight: viewMode === 'grid' ? 1455 : 1492,
        marginTop: "57px",
    };

    const ROW_SIZE = 6;

    const rows = [];
    for (let i = 0; i < advertisements.length; i += ROW_SIZE) {
        rows.push(advertisements.slice(i, i + ROW_SIZE));
    }

    return (
        <div style={containerStyle}>
            {viewMode === "grid" ? (
                rows.map((rowAds, index) => (
                        <AdvRow key={index} advertisements={rowAds} viewMode={viewMode} />
                    ))
                ) : (
                advertisements.map((Ad, index) => (
                    <AdvCard key={index} advertisement={Ad} viewMode={viewMode} />
                ))
            )}
        </div>
    );
}

export default AdvSection