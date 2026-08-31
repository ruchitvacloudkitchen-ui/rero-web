import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepAvailability } from '../components/host-apply/StepAvailability';
import { StepDetails, type Amenities } from '../components/host-apply/StepDetails';
import { StepLocation } from '../components/host-apply/StepLocation';
import { StepOwnerVerification, type OwnerInfoDraft } from '../components/host-apply/StepOwnerVerification';
import { StepPhotos, type DraftImage } from '../components/host-apply/StepPhotos';
import { StepPricing } from '../components/host-apply/StepPricing';
import { StepReview } from '../components/host-apply/StepReview';
import { WizardShell } from '../components/host-apply/WizardShell';
import { useAuth } from '../context/AuthContext';
import { getOrCreateDraft, saveDraftProgress, submitListing, type ListingDraft } from '../services/hostListingService';
import { uploadListingImage, uploadOwnershipDoc } from '../services/storageService';
import type { OpenHours, PropertyType } from '../types';

const STEP_TITLES = [
  { title: 'Where is it?', subtitle: 'Name your place and drop a pin on its location.' },
  { title: 'Add some photos', subtitle: 'At least 3 real photos — compressed automatically.' },
  { title: 'Set your price', subtitle: 'Hourly and night rates, plus a minimum stay.' },
  { title: 'Tell us more', subtitle: 'Description, capacity, and amenities.' },
  { title: 'Availability', subtitle: 'Default hours and any blackout dates.' },
  { title: 'Verify ownership', subtitle: 'Kept private — for manual review only.' },
  { title: 'Review & submit', subtitle: 'Take a last look before it goes to review.' },
];

const DEFAULT_OPEN_HOURS: OpenHours = { start: '08:00', end: '22:00' };

export function HostApplyPage() {
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const [draftId, setDraftId] = useState<string | null>(null);
  const [resuming, setResuming] = useState(true);
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [images, setImages] = useState<DraftImage[]>([]);

  const [pricePerHour, setPricePerHour] = useState('99');
  const [pricePerNight, setPricePerNight] = useState('799');
  const [minBookingHours, setMinBookingHours] = useState(1);

  const [description, setDescription] = useState('');
  const [maxGuests, setMaxGuests] = useState(2);
  const [roomSizeSqft, setRoomSizeSqft] = useState('');
  const [amenities, setAmenities] = useState<Amenities>({
    hasAc: false,
    hasWifi: false,
    hasBathroom: false,
    hasParking: false,
    isInstantBook: false,
    isWomenFriendly: false,
  });

  const [openHours, setOpenHours] = useState<OpenHours>(DEFAULT_OPEN_HOURS);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoDraft>({
    fullName: '',
    phone: '',
    idType: 'aadhaar',
    idNumber: '',
    ownershipDocType: 'aadhaar',
  });
  const [docFiles, setDocFiles] = useState<DraftImage[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Resume an in-progress draft (or create a fresh one) once signed in —
  // this is what makes the wizard survive a closed tab: every "Next" saves
  // to this same Firestore doc (see handleNext).
  useEffect(() => {
    if (!user) return;
    getOrCreateDraft(user.uid).then(({ id, draft }) => {
      setDraftId(id);
      if (draft.title !== undefined) setTitle(draft.title);
      if (draft.propertyType !== undefined) setPropertyType(draft.propertyType);
      if (draft.address !== undefined) setAddress(draft.address);
      if (draft.area !== undefined) setArea(draft.area);
      if (draft.location) {
        setLat(draft.location.lat);
        setLng(draft.location.lng);
      }
      if (draft.imageUrls?.length) {
        setImages(draft.imageUrls.map((url, i) => ({ id: `resumed-${i}`, url, progress: 100, error: null })));
      }
      if (draft.pricePerHour !== undefined) setPricePerHour(String(draft.pricePerHour));
      if (draft.pricePerNight !== undefined) setPricePerNight(String(draft.pricePerNight));
      if (draft.minBookingHours !== undefined) setMinBookingHours(draft.minBookingHours);
      if (draft.description !== undefined) setDescription(draft.description);
      if (draft.maxGuests !== undefined) setMaxGuests(draft.maxGuests);
      if (draft.roomSizeSqft !== undefined && draft.roomSizeSqft !== null) setRoomSizeSqft(String(draft.roomSizeSqft));
      if (draft.amenities) setAmenities(draft.amenities);
      if (draft.openHours) setOpenHours(draft.openHours);
      if (draft.blockedDates) setBlockedDates(draft.blockedDates);
      if (draft.ownerInfo) setOwnerInfo(draft.ownerInfo);
      if (draft.ownerInfo?.idDocumentUrls?.length) {
        setDocFiles(
          draft.ownerInfo.idDocumentUrls.map((url, i) => ({ id: `resumed-doc-${i}`, url, progress: 100, error: null })),
        );
      }
      if (draft.wizardStep !== undefined) setStep(draft.wizardStep);
      setResuming(false);
    });
  }, [user]);

  if (!authLoading && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-tint text-3xl">🔑</div>
        <h1 className="mt-4 text-lg font-bold text-gray-900">Sign in to list your house</h1>
        <p className="mt-2 max-w-xs text-sm text-gray-500">
          We need to know who's listing so bookings and approvals go to the right person.
        </p>
        <button
          type="button"
          disabled={signingIn}
          onClick={async () => {
            setSigningIn(true);
            try {
              await signIn();
            } finally {
              setSigningIn(false);
            }
          }}
          className="mt-6 rounded-full bg-pink-cta px-6 py-3 text-sm font-semibold text-white shadow disabled:opacity-60"
        >
          {signingIn ? 'Signing in…' : 'Sign in with Google'}
        </button>
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-tint text-4xl">🎉</div>
        <h1 className="mt-5 text-xl font-bold text-gray-900">You're almost live!</h1>
        <p className="mt-2 max-w-xs text-sm text-gray-500">
          Your house is under Pending Verification and typically goes live within 24–72 hours. We'll let you
          know once it's approved.
        </p>
        <p className="mt-1 text-xs text-gray-400">Listing ID: {submittedId}</p>
        <button
          type="button"
          onClick={() => navigate('/host/dashboard')}
          className="mt-8 rounded-full bg-pink-cta px-6 py-3 text-sm font-semibold text-white shadow"
        >
          Go to My Listings
        </button>
      </div>
    );
  }

  if (!user || resuming || !draftId) {
    return <div className="p-6 text-center text-sm text-gray-400">Loading…</div>;
  }

  const currentDraft = (): ListingDraft => ({
    wizardStep: step,
    propertyType,
    title,
    address,
    area,
    location: lat != null && lng != null ? { lat, lng } : null,
    description,
    maxGuests,
    roomSizeSqft: roomSizeSqft ? Number(roomSizeSqft) : null,
    amenities,
    imageUrls: images.map((img) => img.url).filter((u): u is string => u !== null),
    pricePerHour: Number(pricePerHour),
    pricePerNight: Number(pricePerNight),
    minBookingHours,
    openHours,
    blockedDates,
    ownerInfo: {
      ...ownerInfo,
      idDocumentUrls: docFiles.map((d) => d.url).filter((u): u is string => u !== null),
    },
  });

  const goBack = () => {
    if (step === 0) {
      navigate(-1);
    } else {
      setStep((s) => s - 1);
    }
  };

  const canProceed = (() => {
    switch (step) {
      case 0:
        return title.trim().length > 0 && propertyType !== null && address.trim().length > 0 && area.length > 0;
      case 1:
        return images.length >= 3 && images.every((img) => img.url !== null);
      case 2:
        return Number(pricePerHour) >= 49 && Number(pricePerNight) >= 49;
      case 3:
        return description.trim().length > 0;
      case 4:
        return true;
      case 5:
        return (
          ownerInfo.fullName.trim().length > 0 &&
          ownerInfo.phone.trim().length > 0 &&
          ownerInfo.idNumber.trim().length > 0 &&
          docFiles.length > 0 &&
          docFiles.every((d) => d.url !== null)
        );
      default:
        return true;
    }
  })();

  const handleAddFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setImages((prev) => [...prev, { id, url: null, progress: 0, error: null }]);
      uploadListingImage(file, user.uid, draftId, (pct) => {
        setImages((prev) => prev.map((img) => (img.id === id ? { ...img, progress: pct } : img)));
      })
        .then((url) => setImages((prev) => prev.map((img) => (img.id === id ? { ...img, url, progress: 100 } : img))))
        .catch((err) => {
          console.error('Image upload failed:', err);
          setImages((prev) => prev.map((img) => (img.id === id ? { ...img, error: 'Upload failed' } : img)));
        });
    });
  };

  const handleRemoveImage = (id: string) => setImages((prev) => prev.filter((img) => img.id !== id));
  const handleMoveImage = (id: string, direction: -1 | 1) => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img.id === id);
      const swapWith = idx + direction;
      if (idx < 0 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  const handleAddDocFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setDocFiles((prev) => [...prev, { id, url: null, progress: 0, error: null }]);
      uploadOwnershipDoc(file, user.uid, draftId, (pct) => {
        setDocFiles((prev) => prev.map((d) => (d.id === id ? { ...d, progress: pct } : d)));
      })
        .then((url) => setDocFiles((prev) => prev.map((d) => (d.id === id ? { ...d, url, progress: 100 } : d))))
        .catch((err) => {
          console.error('Document upload failed:', err);
          setDocFiles((prev) => prev.map((d) => (d.id === id ? { ...d, error: 'Upload failed' } : d)));
        });
    });
  };
  const handleRemoveDocFile = (id: string) => setDocFiles((prev) => prev.filter((d) => d.id !== id));

  const handleNext = async () => {
    const nextStep = step + 1;
    try {
      await saveDraftProgress(draftId, { ...currentDraft(), wizardStep: nextStep });
    } catch (err) {
      console.error('Auto-save failed (continuing anyway):', err);
    }
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const id = await submitListing(draftId, currentDraft(), user);
      setSubmittedId(id);
    } catch (err) {
      console.error('Listing submit failed:', err);
      window.alert('Something went wrong submitting your listing — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepInfo = STEP_TITLES[step];
  const isLastStep = step === STEP_TITLES.length - 1;

  const footer = (
    <button
      type="button"
      disabled={!canProceed || submitting}
      onClick={isLastStep ? handleSubmit : handleNext}
      className="w-full rounded-full bg-pink-cta py-3 text-sm font-semibold text-white shadow disabled:opacity-40"
    >
      {isLastStep ? (submitting ? 'Submitting…' : 'Submit for review') : 'Next'}
    </button>
  );

  return (
    <WizardShell
      stepIndex={step}
      stepCount={STEP_TITLES.length}
      title={stepInfo.title}
      subtitle={stepInfo.subtitle}
      onBack={goBack}
      footer={footer}
    >
      {step === 0 && (
        <StepLocation
          title={title}
          onTitleChange={setTitle}
          propertyType={propertyType}
          onPropertyTypeChange={setPropertyType}
          address={address}
          onAddressChange={setAddress}
          area={area}
          onAreaChange={setArea}
          lat={lat}
          lng={lng}
          onLocationChange={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
        />
      )}
      {step === 1 && (
        <StepPhotos images={images} onAddFiles={handleAddFiles} onRemove={handleRemoveImage} onMove={handleMoveImage} />
      )}
      {step === 2 && (
        <StepPricing
          pricePerHour={pricePerHour}
          onPricePerHourChange={setPricePerHour}
          pricePerNight={pricePerNight}
          onPricePerNightChange={setPricePerNight}
          minBookingHours={minBookingHours}
          onMinBookingHoursChange={setMinBookingHours}
        />
      )}
      {step === 3 && (
        <StepDetails
          description={description}
          onDescriptionChange={setDescription}
          maxGuests={maxGuests}
          onMaxGuestsChange={setMaxGuests}
          roomSizeSqft={roomSizeSqft}
          onRoomSizeChange={setRoomSizeSqft}
          amenities={amenities}
          onToggleAmenity={(key) => setAmenities((prev) => ({ ...prev, [key]: !prev[key] }))}
        />
      )}
      {step === 4 && (
        <StepAvailability
          openHours={openHours}
          onOpenHoursChange={(patch) => setOpenHours((prev) => ({ ...prev, ...patch }))}
          blockedDates={blockedDates}
          onAddBlockedDate={(date) => setBlockedDates((prev) => (prev.includes(date) ? prev : [...prev, date].sort()))}
          onRemoveBlockedDate={(date) => setBlockedDates((prev) => prev.filter((d) => d !== date))}
        />
      )}
      {step === 5 && (
        <StepOwnerVerification
          value={ownerInfo}
          onChange={(patch) => setOwnerInfo((prev) => ({ ...prev, ...patch }))}
          docFiles={docFiles}
          onAddDocFiles={handleAddDocFiles}
          onRemoveDocFile={handleRemoveDocFile}
        />
      )}
      {step === 6 && propertyType && (
        <StepReview
          propertyType={propertyType}
          address={address}
          area={area}
          maxGuests={maxGuests}
          roomSizeSqft={roomSizeSqft}
          amenities={amenities}
          imageUrls={images.map((img) => img.url).filter((u): u is string => u !== null)}
          title={title}
          description={description}
          pricePerHour={pricePerHour}
          pricePerNight={pricePerNight}
          minBookingHours={minBookingHours}
          openHours={openHours}
          blockedDates={blockedDates}
          ownerInfo={ownerInfo}
          ownershipDocCount={docFiles.filter((d) => d.url !== null).length}
        />
      )}
    </WizardShell>
  );
}
