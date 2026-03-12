import {FC, useState} from "react";
import {IAdvertisement, IAdvertisementImage} from "../Advertisement/types.ts";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import EnvConfig from "../../config/env.ts";
import {useNavigate} from "react-router";
import {useAppSelector} from "../../store";
import {
    useAddToFavoritesMutation,
    useGetAllFavoritesQuery,
    useRemoveFromFavoritesMutation
} from "../../services/apiAccount.ts";

type AdvCardProps = {
    advertisement: IAdvertisement;
    viewMode: 'grid' | 'list';
}

const AdvCard: FC<AdvCardProps> = ({advertisement, viewMode}) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const [addToFavorites] = useAddToFavoritesMutation();
    const [removeFromFavorites] = useRemoveFromFavoritesMutation();

    const navigate = useNavigate();

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorites(advertisement.id);
        } else {
            addToFavorites(advertisement.id);
        }
        setIsFavorite(!isFavorite);
    };

    const clickHandle = (id: number) => {
        navigate("/advertisement/" + id)
    }

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite();
    };

    const yearPart = advertisement.updateDate.slice(-7);
    const mainPart = advertisement.updateDate.slice(0, -7);

    const shortDescription = advertisement.description.length < 250 ?
        advertisement.description :
        advertisement.description.slice(0, 250) + '...';

    const {user} = useAppSelector(globalState => globalState.auth);

    const {data: favAdvsData, isLoading: favAdvsLoad, error: favAdvsError} = useGetAllFavoritesQuery(undefined, {
        skip: !user
    });

    if (favAdvsLoad || favAdvsError) return null;

    const favAdvs = favAdvsData? favAdvsData.payload : [];

    //Фото
    const images = advertisement.images as IAdvertisementImage[];
    const mainImg = images?.find(img => img.isMain)?.imageUrl || images?.[0]?.imageUrl;

    return viewMode === "grid" ? (
        <div onClick={() => clickHandle(advertisement.id)}
            className="flex flex-row justify-center items-center px-5 gap-2.5 w-[232px] h-[345px] bg-[rgba(217,217,217,0.3)] hover:scale-102 transition-all rounded-[5px] flex-none cursor-pointer">
            <div className="flex flex-col justify-center items-center gap-1 w-[203px] h-[317px] flex-none">
                <img
                    src={
                        mainImg
                            ? `${EnvConfig.API_URL}/images/advertisements/800_${mainImg}`
                            : `${EnvConfig.API_URL}/images/noimage.jpeg`
                    }
                    alt={advertisement.name}
                    className="w-[204px] h-[138px] rounded-[5px] object-cover"
                />
                <div className="flex flex-col items-start gap-[30px] w-[203px] h-[175px] flex-none">
                    <div className="flex flex-col items-start gap-[23px] w-[203px] h-[65px] flex-none">
                        <span className="w-[203px] h-[24px] pt-3 font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none self-stretch">
                            {advertisement.name}
                        </span>
                    </div>
                    <div className="flex flex-col items-start gap-[16px] w-[203px] h-[65px] flex-none">
                        <span className="w-[203px] h-[34px] font-inter font-light text-[14px] leading-[17px] text-[#071739] flex-none self-stretch">
                            {advertisement.settlement?.description} - {mainPart}{" "}

                            <span className="whitespace-nowrap">{yearPart}</span>
                        </span>

                        <div className="flex flex-row items-center gap-[27px] w-[203px] h-[19px] flex-none self-stretch">
                            <span className="w-[140px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none">
                                {advertisement.price} грн
                            </span>

                            <button onClick={handleFavoriteClick} className="cursor-pointer">
                                {favAdvs.some(fav => fav.id === advertisement.id)
                                    ? <HeartFilled className="text-[22px]"/>
                                    : <HeartOutlined className="text-[22px]"/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div onClick={() => clickHandle(advertisement.id)} className="flex flex-col items-start cursor-pointer hover:scale-102 transition-all p-[19px_17px] gap-[10px] w-[1428px] h-[176px] bg-[rgba(217,217,217,0.3)] rounded-[5px] flex-none self-stretch">
            <div className="flex flex-row items-center p-0 gap-[30px] w-[1371px] h-[138px] flex-none">
                <img
                    src={
                        mainImg
                            ? `${EnvConfig.API_URL}/images/advertisements/800_${mainImg}`
                            : `${EnvConfig.API_URL}/images/noimage.jpeg`
                    }
                    alt={advertisement.name}
                    className="w-[204px] h-[138px] rounded-[5px] object-cover"
                />

                <div className="flex flex-col items-start p-0 gap-[60px] w-[1137px] h-[126px] flex-none">
                    <div className="flex flex-row justify-between items-start p-0 gap-[825px] w-[1137px] h-[49px] flex-none">
                        <div className="flex flex-col items-start p-0 gap-[12px] w-[212px] h-[49px] flex-none">
                            <span className="w-[700px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none self-stretch">
                                {advertisement.name}
                            </span>

                            <span className="w-[700px] h-[19px] font-inter font-light text-[13px] leading-[19px] text-[#5A617E] flex-none self-stretch">
                                {shortDescription}
                            </span>
                        </div>

                        <span className="w-[100px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none text-right">
                            {advertisement.price} грн
                        </span>
                    </div>

                    <div className="flex flex-row justify-between items-start p-0 gap-[813px] w-[1137px] h-[17px] flex-none">
                        <span className="w-[300px] h-[17px] font-inter font-light text-[14px] leading-[17px] text-[#071739] flex-none">
                            {advertisement.settlement?.description} - {advertisement.updateDate}
                        </span>

                        <div className="w-[18px] h-[16px] flex-none">
                            <button onClick={handleFavoriteClick} className="cursor-pointer">
                                {favAdvs.some(fav => fav.id === advertisement.id)
                                    ? <HeartFilled className="text-[22px]"/>
                                    : <HeartOutlined className="text-[22px]"/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvCard