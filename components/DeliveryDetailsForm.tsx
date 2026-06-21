"use client";

import React, { useRef, useState } from "react";
import { ChevronDown, MapPin, Truck } from "lucide-react";
import {
  PICKUP_STATIONS,
  type DeliveryDetails,
  saveDeliveryDetails,
} from "@/lib/delivery";

type Props = {
  value: DeliveryDetails;
  onChange: (details: DeliveryDetails) => void;
  defaultOpen?: boolean;
  compact?: boolean;
};

const fieldClass =
  "w-full bg-transparent border border-parchment/20 px-3 py-2.5 text-sm text-parchment placeholder:text-parchment/35 focus:outline-none focus:border-gold-oud/50 transition-colors normal-case";

const labelClass =
  "block text-xs text-parchment/60 mb-1.5 normal-case";

const DeliveryDetailsForm = ({ value, onChange, defaultOpen = true, compact = false }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const update = (patch: Partial<DeliveryDetails>) => {
    const next = { ...value, ...patch };
    onChange(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDeliveryDetails(next), 300);
  };

  return (
    <div className={`border border-parchment/15 bg-parchment/[0.02] ${compact ? "" : "rounded-sm"}`}>
      <div className={`px-4 ${compact ? "pt-3 pb-3" : "py-4"} space-y-3`}>
        <p className="text-xs text-parchment/50 normal-case flex items-center gap-2">
          <MapPin size={13} className="text-gold-oud flex-shrink-0" />
          Your details for WhatsApp order
        </p>

        <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
          <div>
            <label className={labelClass}>Your name</label>
            <input
              type="text"
              value={value.fullName}
              onChange={(e) => update({ fullName: e.target.value })}
              placeholder="e.g. Kwame Mensah"
              className={fieldClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp number</label>
            <input
              type="tel"
              value={value.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder="e.g. 0203154307"
              className={fieldClass}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>City / area</label>
          <input
            type="text"
            value={value.city}
            onChange={(e) => update({ city: e.target.value })}
            placeholder="e.g. East Legon, Takoradi, Kumasi"
            className={fieldClass}
            required
          />
        </div>

        <div>
          <p className={labelClass}>How to receive</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update({ method: "delivery" })}
              className={`py-2.5 text-xs border transition-colors flex items-center justify-center gap-1.5 normal-case ${
                value.method === "delivery"
                  ? "bg-gold-oud text-deep-noir border-gold-oud"
                  : "border-parchment/20 text-parchment/70 hover:border-parchment/40"
              }`}
            >
              <Truck size={13} />
              Delivery
            </button>
            <button
              type="button"
              onClick={() => update({ method: "pickup" })}
              className={`py-2.5 text-xs border transition-colors flex items-center justify-center gap-1.5 normal-case ${
                value.method === "pickup"
                  ? "bg-gold-oud text-deep-noir border-gold-oud"
                  : "border-parchment/20 text-parchment/70 hover:border-parchment/40"
              }`}
            >
              <MapPin size={13} />
              Pickup
            </button>
          </div>
        </div>

        {value.method === "pickup" && (
          <div>
            <label className={labelClass}>Pickup station</label>
            <select
              value={value.pickupStation}
              onChange={(e) => update({ pickupStation: e.target.value })}
              className={fieldClass}
              required
            >
              <option value="" className="bg-surface text-parchment">
                Select pickup location
              </option>
              {PICKUP_STATIONS.map((station) => (
                <option key={station} value={station} className="bg-surface text-parchment">
                  {station}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMore((o) => !o)}
          className="flex items-center gap-1.5 text-xs text-parchment/40 hover:text-parchment/70 transition-colors normal-case"
        >
          <ChevronDown size={13} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
          {showMore ? "Hide" : "Add"} full address (optional)
        </button>

        {showMore && (
          <div className="space-y-3 pt-1 border-t border-parchment/10">
            {value.method === "delivery" && (
              <div>
                <label className={labelClass}>Street / landmark</label>
                <input
                  type="text"
                  value={value.street}
                  onChange={(e) => update({ street: e.target.value })}
                  placeholder="House no., street, landmark"
                  className={fieldClass}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>Region</label>
              <input
                type="text"
                value={value.region}
                onChange={(e) => update({ region: e.target.value })}
                placeholder="e.g. Greater Accra"
                className={fieldClass}
              />
            </div>
          </div>
        )}

        <p className="text-[11px] text-parchment/40 normal-case leading-relaxed">
          You can also send your full address in the WhatsApp chat after ordering.
        </p>
      </div>
    </div>
  );
};

export default DeliveryDetailsForm;
