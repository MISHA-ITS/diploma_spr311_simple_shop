import PopularImage from "../../icons/PopularImage.png"
import SectionImage from "../../icons/SectionOnService.png"
import * as React from "react";

const Explore: React.FC = () => {
    return (
        <div className="w-full h-[658px] bg-[#D1DFFD] flex justify-center items-center">
            <div className="w-[1275px] h-[341px] flex flex-col gap-[26px]">
                <div className="w-full h-[217px] flex items-center justify-between">
                    <img
                        src={PopularImage}
                        alt="Popular"
                        className="w-[516px] h-[217px] rounded-[5px] object-cover"
                    />

                    <img
                        src={SectionImage}
                        alt="Sections"
                        className="w-[516px] h-[217px] rounded-[5px] object-cover"
                    />
                </div>

                {/* ДРУГИЙ БЛОК */}
                <div className="w-[1248px] h-[98px] flex items-start justify-between">
                    <p className="w-[490px] text-[18px] leading-[24px] font-inter text-[#071739]">
                        <span className="font-semibold text-[20px]">
                            Популярні запити:
                        </span>{" "}
                        жіночий одяг, ремонт холодильників, оренда квартири,
                        книги, дитячий візок, домашній котик, вакансія СММ,
                        графічний планшет, монітор, диван, шафа, посуд,
                        барна стійка, дрова.
                    </p>

                    <p className="w-[490px] text-[17px] leading-[24px] font-inter text-[#071739]">
                        <span className="font-semibold text-[20px]">
                            Розділи на сервісі SELLIX:
                        </span>{" "}

                        Авто, Запчастини, Робота, Нерухомість,
                        Електроніка, Дім і сад, Тварини, Обмін,
                        Мода і стиль, Дитячий світ, Допомога,
                        Бізнес та послуги, Житло подобово,
                        Оренда та прокат, Безкоштовно,
                        Хобі, відпочинок та спорт.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Explore;