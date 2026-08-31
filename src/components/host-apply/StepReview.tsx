import { formatPrice } from '../../lib/format';
import {
  ID_TYPE_LABEL,
  LISTING_AMENITIES,
  OWNERSHIP_DOC_TYPE_LABEL,
  PROPERTY_TYPE_LABEL,
  type IdType,
  type OpenHours,
  type OwnershipDocType,
  type PropertyType,
} from '../../types';
import type { Amenities } from './StepDetails';

export function StepReview({
  propertyType,
  address,
  area,
  maxGuests,
  roomSizeSqft,
  amenities,
  imageUrls,
  title,
  description,
  pricePerHour,
  pricePerNight,
  minBookingHours,
  openHours,
  blockedDates,
  ownerInfo,
  ownershipDocCount,
}: {
  propertyType: PropertyType;
  address: string;
  area: string;
  maxGuests: number;
  roomSizeSqft: string;
  amenities: Amenities;
  imageUrls: string[];
  title: string;
  description: string;
  pricePerHour: string;
  pricePerNight: string;
  minBookingHours: number;
  openHours: OpenHours;
  blockedDates: string[];
  ownerInfo: { fullName: string; phone: string; idType: IdType; idNumber: string; ownershipDocType: OwnershipDocType };
  ownershipDocCount: number;
}) {
  const activeAmenities = LISTING_AMENITIES.filter((a) => amenities[a.key]);

  return (
    <div className="flex flex-col gap-4">
      {imageUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {imageUrls.map((url) => (
            <img key={url} src={url} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-pink-tint p-4">
        <p className="text-base font-bold text-gray-900">{title || 'Untitled listing'}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {address}, {area}, Hyderabad
        </p>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-pink-tint px-2.5 py-1 text-[11px] font-medium text-on-pink">
            {PROPERTY_TYPE_LABEL[propertyType].title}
          </span>
          <span className="rounded-full bg-teal-tint px-2.5 py-1 text-[11px] font-medium text-on-teal">
            {maxGuests} guests
          </span>
          {roomSizeSqft && (
            <span className="rounded-full bg-teal-tint px-2.5 py-1 text-[11px] font-medium text-on-teal">
              {roomSizeSqft} sq. ft
            </span>
          )}
        </div>

        {activeAmenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeAmenities.map((a) => (
              <span key={a.key} className="flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-[11px] text-gray-600">
                {a.icon} {a.label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-pink-tint pt-3">
          <div>
            <p className="text-xs text-gray-400">Hourly rate</p>
            <p className="text-lg font-extrabold text-pink-cta">{formatPrice(Number(pricePerHour) || 0)}/hr</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Night rate</p>
            <p className="text-lg font-extrabold text-on-teal">{formatPrice(Number(pricePerNight) || 0)}/night</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">Minimum booking: {minBookingHours} hour{minBookingHours > 1 ? 's' : ''}</p>
      </div>

      <div className="rounded-2xl border border-pink-tint bg-white p-4">
        <p className="text-xs font-semibold text-gray-600">Availability</p>
        <p className="mt-1.5 text-xs text-gray-500">
          Open {openHours.start} – {openHours.end} daily
        </p>
        {blockedDates.length > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            {blockedDates.length} blackout date{blockedDates.length > 1 ? 's' : ''} set
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-pink-tint bg-white p-4">
        <p className="text-xs font-semibold text-gray-600">Owner verification (private — for review only)</p>
        <p className="mt-1.5 text-xs text-gray-500">{ownerInfo.fullName}</p>
        <p className="text-xs text-gray-500">{ownerInfo.phone}</p>
        <p className="text-xs text-gray-500">
          {ID_TYPE_LABEL[ownerInfo.idType]}: {ownerInfo.idNumber}
        </p>
        <p className="mt-1.5 text-xs text-gray-500">
          {OWNERSHIP_DOC_TYPE_LABEL[ownerInfo.ownershipDocType]} — {ownershipDocCount} document
          {ownershipDocCount !== 1 ? 's' : ''} uploaded
        </p>
      </div>

      <p className="rounded-xl bg-teal-tint p-3 text-xs text-on-teal">
        Once submitted, your listing goes to <strong>Pending Verification</strong> and typically goes live
        within 24–72 hours. You won't see it on Home/Search until then.
      </p>
    </div>
  );
}
