"use client";

import React, { useRef, useState } from "react";
import { ChevronDown, MapPin, Truck } from "lucide-react";
import {
  COUNTRY_OPTIONS,
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
  "w-full bg-transparent border border-parchment/20 px-3 py-2.5 text-xs text-parchment placeholder:text-parchment/35 focus:outline-none focus:border-gold-oud/50 transition-colors normal-case";

const labelClass =
  "block text-[10px] uppercase tracking-[0.2em] text-parchment/50 mb-1.5 normal-case";

const DeliveryDetailsForm = ({ value, onChange, defaultOpen = false, compact = false }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const update = (patch: Partial<DeliveryDetails>) => {
    const next = { ...value, ...patch };
    onChange(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDeliveryDetails(next), 300);
  };

  return (
    <div className={`border border-parchment/15 bg-parchment/[0.02] ${compact ? "" : "rounded-sm"}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-parchment/5 transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-parchment/70 font-bold flex items-center gap-2">
          <MapPin size={13} className="text-gold-oud" />
          Delivery / Pickup
        </span>
        <ChevronDown
          size={14}
          className={`text-parchment/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className={`px-4 pb-4 space-y-3 border-t border-parchment/10 ${compact ? "pt-3" : "pt-4"}`}>
          <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type="text"
                value={value.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
                placeholder="Your full name"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Phone (WhatsApp)</label>
              <input
                type="tel"
                value={value.phone}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="e.g. 0506626068"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Country</label>
            <select
              value={value.country}
              onChange={(e) => update({ country: e.target.value })}
              className={fieldClass}
              required
            >
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country} className="bg-surface text-parchment">
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className={labelClass}>How do you want to receive your order?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update({ method: "delivery" })}
                className={`py-2.5 text-[10px] uppercase tracking-wider border transition-colors flex items-center justify-center gap-1.5 ${
                  value.method === "delivery"
                    ? "bg-gold-oud text-deep-noir border-gold-oud"
                    : "border-parchment/20 text-parchment/70 hover:border-parchment/40"
                }`}
              >
                <Truck size={12} />
                Home delivery
              </button>
              <button
                type="button"
                onClick={() => update({ method: "pickup" })}
                className={`py-2.5 text-[10px] uppercase tracking-wider border transition-colors flex items-center justify-center gap-1.5 ${
                  value.method === "pickup"
                    ? "bg-gold-oud text-deep-noir border-gold-oud"
                    : "border-parchment/20 text-parchment/70 hover:border-parchment/40"
                }`}
              >
                <MapPin size={12} />
                Pickup
              </button>
            </div>
          </div>

          {value.method === "delivery" ? (
            <div>
              <label className={labelClass}>Street / area</label>
              <input
                type="text"
                value={value.street}
                onChange={(e) => update({ street: e.target.value })}
                placeholder="House no., street, landmark"
                className={fieldClass}
                required
              />
            </div>
          ) : (
            <div>
              <label className={labelClass}>Pickup station</label>
              <select
                value={value.pickupStation}
                onChange={(e) => update({ pickupStation: e.target.value })}
                className={fieldClass}
                required
              >
                <option value="" className="bg-surface text-parchment">
                  Select pickup station
                </option>
                {PICKUP_STATIONS.map((station) => (
                  <option key={station} value={station} className="bg-surface text-parchment">
                    {station}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={value.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="City"
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Region / state</label>
              <input
                type="text"
                value={value.region}
                onChange={(e) => update({ region: e.target.value })}
                placeholder="Region"
                className={fieldClass}
                required
              />
            </div>
          </div>

          <p className="text-[10px] text-parchment/40 normal-case leading-relaxed">
            These details are included when you checkout on WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryDetailsForm;
