import { useEffect, useMemo, useState } from "react";
import {
    useGetAreasQuery,
    useGetRegionsByAreaQuery,
    useGetSettlementsByRegionQuery,
    useGetWarehousesQuery,
} from "../../services/apiNewPost";
import { useProfileQuery } from "../../services/apiAccount";

type DeliveryMethod = "nova_poshta" | "courier";

const OrderPage = () => {
    // ==============================
    // PROFILE (AUTO-FILL)
    // ==============================

    const { data: profile } = useProfileQuery();

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (profile) {
            setFullName(profile.fullName ?? "");
            setPhone(profile.phoneNumber ?? "");
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
        fullName.trim().length > 3 &&
        phone.trim().length > 8 &&
        isLocationValid;

    // ==============================
    // SUBMIT
    // ==============================

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        const orderPayload = {
            fullName,
            phone,
            deliveryMethod,
            areaRef,
            regionRef,
            settlementRef,
            warehouseRef:
                deliveryMethod === "nova_poshta" ? warehouseRef : null,
            courierAddress:
                deliveryMethod === "courier" ? courierAddress : null,
        };

        console.log("ORDER:", orderPayload);
    };

    // ==============================
    // UI
    // ==============================

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Оформлення замовлення
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* PERSONAL INFO */}
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="ПІБ"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border p-3 rounded"
                        required
                    />

                    <input
                        type="tel"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border p-3 rounded"
                        required
                    />
                </div>

                {/* DELIVERY METHOD */}
                <div>
                    <h2 className="font-medium mb-3">Спосіб доставки</h2>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={deliveryMethod === "nova_poshta"}
                                onChange={() =>
                                    setDeliveryMethod("nova_poshta")
                                }
                            />
                            Нова Пошта
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={deliveryMethod === "courier"}
                                onChange={() =>
                                    setDeliveryMethod("courier")
                                }
                            />
                            Кур'єр
                        </label>
                    </div>
                </div>

                {/* LOCATION (СПІЛЬНИЙ БЛОК) */}
                <div className="space-y-4">

                    <select
                        value={areaRef ?? ""}
                        onChange={(e) =>
                            setAreaRef(e.target.value || null)
                        }
                        className="w-full border p-3 rounded"
                        required
                    >
                        <option value="">Оберіть область</option>
                        {areas.map((a) => (
                            <option key={a.ref} value={a.ref}>
                                {a.description}
                            </option>
                        ))}
                    </select>

                    <select
                        value={regionRef ?? ""}
                        onChange={(e) =>
                            setRegionRef(e.target.value || null)
                        }
                        disabled={!areaRef}
                        className="w-full border p-3 rounded"
                        required
                    >
                        <option value="">Оберіть район</option>
                        {regions.map((r) => (
                            <option key={r.ref} value={r.ref}>
                                {r.description}
                            </option>
                        ))}
                    </select>

                    <select
                        value={settlementRef ?? ""}
                        onChange={(e) =>
                            setSettlementRef(e.target.value || null)
                        }
                        disabled={!regionRef}
                        className="w-full border p-3 rounded"
                        required
                    >
                        <option value="">Оберіть населений пункт</option>
                        {settlements.map((s) => (
                            <option key={s.ref} value={s.ref}>
                                {s.description}
                            </option>
                        ))}
                    </select>

                    {/* NOVA POSHTA */}
                    {deliveryMethod === "nova_poshta" && (
                        <select
                            value={warehouseRef ?? ""}
                            onChange={(e) =>
                                setWarehouseRef(e.target.value || null)
                            }
                            disabled={!settlementRef}
                            className="w-full border p-3 rounded"
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

                    {/* COURIER */}
                    {deliveryMethod === "courier" && (
                        <input
                            type="text"
                            placeholder="Введіть точну адресу доставки"
                            value={courierAddress}
                            onChange={(e) =>
                                setCourierAddress(e.target.value)
                            }
                            className="w-full border p-3 rounded"
                            required
                        />
                    )}
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full py-3 rounded text-white transition ${
                        isFormValid
                            ? "bg-black hover:opacity-90"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Підтвердити замовлення
                </button>
            </form>
        </div>
    );
};

export default OrderPage;
