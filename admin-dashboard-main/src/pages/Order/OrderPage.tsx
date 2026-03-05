import { useEffect, useMemo, useState } from "react";
import {
    useGetAreasQuery,
    useGetRegionsByAreaQuery,
    useGetSettlementsByRegionQuery,
    useGetWarehousesQuery,
} from "../../services/apiNewPost";
import { useProfileQuery } from "../../services/apiAccount";
import { useCreateOrderMutation } from "../../services/apiOrder";
import {DeliveryType, OrderCreateDto, PaymentMethod} from "./types.ts";
import { useParams } from "react-router-dom";
import {useGetAdvertisementByIdQuery} from "../../services/apiAdvertisement.ts";
import EnvConfig from "../../config/env.ts";
import { useNavigate } from "react-router-dom";

type DeliveryMethod = "nova_poshta" | "courier";

const OrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const advertisementId = useMemo(() => {
        return id ? Number(id) : 0;
    }, [id]);

    console.log("ADVERTISEMENT ID:", id);

    const urlAdImage = `${EnvConfig.API_URL}/images/advertisements`;
    //const urlAdImage = `${EnvConfig.API_URL}/images`;

    const { data: advertisement, isLoading: adLoading } =
        useGetAdvertisementByIdQuery(advertisementId, {
            skip: !advertisementId,
        });

    console.log("ADVERTISEMENT:", advertisement);

    // ==============================
    // PROFILE (AUTO-FILL)
    // ==============================

    const { data: profile } = useProfileQuery();

    useEffect(() => {
        console.log("PROFILE:", profile);
    }, [profile]);


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    //const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (profile?.payload) {
            const user = profile.payload;

            setFirstName(user.firstName ?? "");
            setLastName(user.lastName ?? "");
            setEmail(user.email ?? "");
            setPhone(user.phoneNumber ?? "");
        }
    }, [profile]);

    // ==============================
    // DELIVERY METHOD
    // ==============================

    const [deliveryMethod, setDeliveryMethod] =
        useState<DeliveryMethod>("nova_poshta");

    // ==============================
    // LOCATION STATE
    // ==============================

    const [areaRef, setAreaRef] = useState<string | null>(null);
    const [regionRef, setRegionRef] = useState<string | null>(null);
    const [settlementRef, setSettlementRef] = useState<string | null>(null);
    const [warehouseRef, setWarehouseRef] = useState<string | null>(null);

    const [courierAddress, setCourierAddress] = useState("");

    // ==============================
    // API CALLS
    // ==============================

    const { data: areas = [] } = useGetAreasQuery();

    const { data: regions = [] } = useGetRegionsByAreaQuery(areaRef!, {
        skip: !areaRef,
    });

    const { data: settlements = [] } =
        useGetSettlementsByRegionQuery(regionRef!, {
            skip: !regionRef,
        });

    const { data: warehouses = [] } =
        useGetWarehousesQuery(settlementRef!, {
            skip: !settlementRef,
        });

    const [createOrder, { isLoading }] = useCreateOrderMutation();


    // ==============================
    // RESET LOGIC
    // ==============================

    useEffect(() => {
        setRegionRef(null);
        setSettlementRef(null);
        setWarehouseRef(null);
    }, [areaRef]);

    useEffect(() => {
        setSettlementRef(null);
        setWarehouseRef(null);
    }, [regionRef]);

    useEffect(() => {
        setWarehouseRef(null);
    }, [settlementRef]);

    // ==============================
    // VALIDATION (BUTTON LOCK)
    // ==============================

    const isLocationValid = useMemo(() => {
        if (!areaRef || !regionRef || !settlementRef) return false;

        if (deliveryMethod === "nova_poshta") {
            return !!warehouseRef;
        }

        if (deliveryMethod === "courier") {
            return courierAddress.trim().length > 5;
        }

        return false;
    }, [
        areaRef,
        regionRef,
        settlementRef,
        warehouseRef,
        courierAddress,
        deliveryMethod,
    ]);

    const isFormValid =
        //fullName.trim().length > 3 &&
        firstName.trim().length > 3 &&
        lastName.trim().length > 3 &&
        phone.trim().length > 8 &&
        email.trim().length > 8 &&
        isLocationValid;

    // ==============================
    // SUBMIT
    // ==============================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        //const [firstName, lastName] = fullName.split(" ");

        const orderPayload: OrderCreateDto = {
            advertisementId,

            firstName,
            lastName,
            email,
            phoneNumber: phone,

            deliveryMethod:
                deliveryMethod === "nova_poshta"
                    ? DeliveryType.NewPost
                    : DeliveryType.Courier,

            settlement: settlementRef,

            newPostWarehouse:
                deliveryMethod === "nova_poshta"
                    ? warehouseRef
                    : null,

            deliveryAddress:
                deliveryMethod === "courier"
                    ? courierAddress
                    : null,

            paymentMethod: PaymentMethod.Cash
        };

        try {
            await createOrder(orderPayload).unwrap();
            alert("Замовлення створено успішно!");
            navigate(`/advertisement/${advertisementId}`);
        } catch (error) {
            console.error(error);
            alert("Помилка при створенні замовлення");
        }
    };

    // ==============================
    // UI
    // ==============================

    if (!profile) {
        return <div className="p-6">Завантаження профілю...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold text-center mb-10">
                Купити з доставкою
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* ================= LEFT COLUMN ================= */}
                <div className="space-y-8">

                    {/* PRODUCT BLOCK */}
                    {adLoading ? (
                        <div>Завантаження товару...</div>
                    ) : advertisement?.payload && (
                        <div className="flex gap-6 border rounded-xl shadow-sm bg-white">
                            {/*<img*/}
                            {/*    src={*/}
                            {/*        advertisement.payload.images?.length*/}
                            {/*            ? `${urlAdImage}/800_${advertisement.payload.images[0]}`*/}
                            {/*            : "/noimage.jpeg"*/}
                            {/*    }*/}
                            {/*    alt={advertisement.payload.name}*/}
                            {/*    className="w-32 h-32 object-cover rounded-lg border"*/}
                            {/*/>*/}

                            {/* IMAGE */}
                            {advertisement.payload.images?.length > 0 ? (
                                <img
                                    src={`${urlAdImage}/400_${advertisement.payload.images[0]}`}
                                    alt={advertisement.payload.name}
                                    className="w-36 h-36 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-36 h-36 flex items-center justify-center rounded-lg border text-xs text-gray-400 bg-gray-100">
                                    Немає фото
                                </div>
                            )}

                            <div className="flex flex-col p-2 justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {advertisement.payload.name}
                                    </h2>
                                    <p className="text-xl text-gray-500 mt-1">
                                        {advertisement.payload.price} грн
                                    </p>
                                    {/*<p className="text-sm text-gray-500 mt-1">*/}
                                    {/*    {advertisement.payload.description}*/}
                                    {/*</p>*/}
                                </div>

                                {/*<div className="text-xl font-bold mt-4">*/}
                                {/*    {advertisement.payload.price} грн*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    )}

                    {/* DELIVERY SERVICE */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Служба доставки
                            </h2>
                            <p className="text-sm text-gray-500">
                                Оберіть спосіб отримання замовлення
                            </p>
                        </div>

                        {/* WAREHOUSE */}
                        <div
                            onClick={() => setDeliveryMethod("nova_poshta")}
                            className={`cursor-pointer border rounded-xl p-5 flex justify-between items-center transition
                            ${deliveryMethod === "nova_poshta"
                                ? "border-black bg-gray-50"
                                : "border-gray-400 hover:border-black bg-gray-200"}
                        `}
                        >
                            <div>
                                <div className="font-medium">
                                    У відділення Нова Пошта (оплата у відділенні)
                                </div>
                                <div className="text-sm text-gray-500">
                                    доставка протягом 1-3 днів
                                </div>
                                <hr className="my-2 border-gray-400" />
                                <div className="font-medium text-gray-500">
                                    Доставка від 60 грн
                                </div>
                            </div>

                            <img
                                src="/nova-poshta-logo.svg"
                                alt="NP"
                                className="w-16 object-contain"
                            />
                        </div>

                        {/* COURIER */}
                        <div
                            onClick={() => setDeliveryMethod("courier")}
                            className={`cursor-pointer border rounded-xl p-5 flex justify-between items-center transition
                            ${deliveryMethod === "courier"
                                ? "border-black bg-gray-50"
                                : "border-gray-300 hover:border-black bg-gray-200"}
                        `}
                        >
                            <div>
                                <div className="font-medium">
                                    Кур'єром Нова Пошта (оплата готівкою кур'єру)
                                </div>
                                <div className="text-sm text-gray-500">
                                    доставка протягом 1-3 днів
                                </div>
                                <hr className="my-2 border-gray-400" />
                                <div className="font-medium text-gray-500">
                                    Доставка від 95 грн
                                </div>
                            </div>

                            <img
                                src="/nova-poshta-logo.svg"
                                alt="NP"
                                className="w-16 object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div>

                    <div className="border rounded-xl p-8 shadow-sm bg-white space-y-6">

                        <div>
                            <h2 className="text-lg font-semibold">
                                Контактні дані
                            </h2>
                            <p className="text-sm text-gray-500">
                                Заповніть контактні дані отримувача
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* CONTACT FIELDS */}
                            <div className="relative">
                                <p className="text-sm mb-0 text-gray-500">
                                    Прізвище*
                                </p>
                                <input
                                    type="text"
                                    placeholder="Прізвище"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                    required
                                />
                                {lastName.trim().length > 2 && (
                                    <span className="absolute right-0 top-9 text-gray-500">
                                        ✓
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <p className="text-sm mb-0 text-gray-500">
                                    Ім'я*
                                </p>
                                <input
                                    type="text"
                                    placeholder="Ім'я"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                    required
                                />
                                {firstName.trim().length > 2 && (
                                    <span className="absolute right-0 top-9 text-gray-500">
                                        ✓
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <p className="text-sm mb-0 text-gray-500">
                                    Номер телефону*
                                </p>
                                <input
                                    type="tel"
                                    placeholder="Номер телефону"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                    required
                                />
                                {phone.trim().length == 13 && (
                                    <span className="absolute right-0 top-9 text-gray-500">
                                        ✓
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <p className="text-sm mb-0 text-gray-500">
                                    Електронна пошта*
                                </p>
                                <input
                                    type="email"
                                    placeholder="Електронна пошта"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                    required
                                />
                                {email.trim().length > 6 && (
                                    <span className="absolute right-0 top-9 text-gray-500">
                                        ✓
                                    </span>
                                )}
                            </div>

                            {/* LOCATION SELECTS */}
                            <div className="space-y-3 pt-4">

                                <p className="text-sm mb-0 text-gray-500">
                                    Область*
                                </p>
                                <select
                                    value={areaRef ?? ""}
                                    onChange={(e) => setAreaRef(e.target.value || null)}
                                    className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                    required
                                >
                                    <option value="">Оберіть область</option>
                                    {areas.map((a) => (
                                        <option key={a.ref} value={a.ref}>
                                            {a.description}
                                        </option>
                                    ))}
                                </select>

                                <p className="text-sm mb-0 text-gray-500">
                                    Района*
                                </p>
                                <select
                                    value={regionRef ?? ""}
                                    onChange={(e) => setRegionRef(e.target.value || null)}
                                    disabled={!areaRef}
                                    className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                    required
                                >
                                    <option value="">Оберіть район</option>
                                    {regions.map((r) => (
                                        <option key={r.ref} value={r.ref}>
                                            {r.description}
                                        </option>
                                    ))}
                                </select>

                                <p className="text-sm mb-0 text-gray-500">
                                    Населений пункт*
                                </p>
                                <select
                                    value={settlementRef ?? ""}
                                    onChange={(e) => setSettlementRef(e.target.value || null)}
                                    disabled={!regionRef}
                                    className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                    required
                                >
                                    <option value="">Оберіть населений пункт</option>
                                    {settlements.map((s) => (
                                        <option key={s.ref} value={s.ref}>
                                            {s.description}
                                        </option>
                                    ))}
                                </select>

                                {/* CONDITIONAL BLOCK */}
                                <p className="text-sm mb-0 text-gray-500">
                                    Відділення Нової Пошти або адреса отримувача*
                                </p>
                                {deliveryMethod === "nova_poshta" &&  (
                                    <select
                                        value={warehouseRef ?? ""}
                                        onChange={(e) => setWarehouseRef(e.target.value || null)}
                                        disabled={!settlementRef}
                                        className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                        required
                                    >
                                        <option value="">Оберіть відділення</option>
                                        {warehouses.map((w) => (
                                            <option key={w.ref} value={w.ref}>
                                                {w.description}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {deliveryMethod === "courier" && (
                                    <input
                                        type="text"
                                        placeholder="Введіть точну адресу доставки"
                                        value={courierAddress}
                                        onChange={(e) => setCourierAddress(e.target.value)}
                                        className="w-full border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mt-1 p-5">
                                    *обов'язкове поле для заповнення
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full py-3 rounded-lg text-white font-medium transition
                                ${isFormValid
                                    ? "bg-black hover:opacity-90"
                                    : "bg-gray-400 cursor-not-allowed"}
                            `}
                            >
                                {isLoading
                                    ? "Створення..."
                                    : "Підтвердити замовлення"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
