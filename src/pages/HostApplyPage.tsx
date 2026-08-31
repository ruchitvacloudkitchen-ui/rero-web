import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepDetails, type Amenities } from '../components/host-apply/StepDetails';
import { StepLocation } from '../components/host-apply/StepLocation';
import { StepOwnerVerification, type OwnerInfoDraft } from '../components/host-apply/StepOwnerVerification';
import { StepPhotos, type DraftImage } from '../components/host-apply/StepPhotos';
import { StepPricing } from '../components/host-apply/StepPricing';
import { StepPropertyType } from '../components/host-apply/StepPropertyType';
import { StepReview } from '../components/host-apply/StepReview';
import { StepTitleDescription } from '../components/host-apply/StepTitleDescription';
import { WizardShell } from '../components/host-apply/WizardShell';
import { useAuth } from '../context/AuthContext';
import { submitListing } from '../services/hostListingService';
import { uploadListingImage } from '../services/storageService';
import type { PropertyType } from '../types';

const STEP_TITLES = [
  { title: 'What are you listing?', subtitle: 'Choose the type of place guests will get.' },
  { title: 'Where is it?', subtitle: 'ReRo only operates in Hyderabad right now.' },
  { title: 'Tell us the details', subtitle: 'Guests use this to decide if it fits.' },
  { title: 'Add some photos', subtitle: 'Listings with real photos get booked faster.' },
  { title: 'Give it a title', subtitle: 'Make it easy to picture the space.' },
  { title: 'Set your price', subtitle: "ReRo bookings are hourly, not nightly." },
  { title: 'Verify you own this place', subtitle: 'Kept private — for manual review only.' },
  { title: 'Review & submit', subtitle: 'Take a last look before it goes to review.' },
];

const draftId = () => `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function HostApplyPage() {
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const [step, setStep] = useState(0);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
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
  const [images, setImages] = useState<DraftImage[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerHour, setPricePerHour] = useState('99');
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfoDraft>({
    fullName: '',
    phone: '',
    idType: 'aadhaar',
    idNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const listingDraftId = useState(draftId)[0];

  if (!authLoading && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-tint text-3xl">🔑</div>
        <h1 className="mt-4 text-lg font-bold text-gray-900">Sign in to list your home</h1>
        <p className="mt-2 max-w-xs text-sm text-gray-500">
          We need to know who's listing so bookings and payouts go to the right person.
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
          Your listing is under review and typically goes live within 24–72 hours. We'll notify you once it's
          approved.
        </p>
        <p className="mt-1 text-xs text-gray-400">Listing ID: {submittedId}</p>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="mt-8 rounded-full bg-pink-cta px-6 py-3 text-sm font-semibold text-white shadow"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center text-sm text-gray-400">Loading…</div>;
  }

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
        return propertyType !== null;
      case 1:
        return address.trim().length > 0 && area.length > 0;
      case 2:
        return maxGuests > 0;
      case 3:
        return images.length > 0 && images.every((img) => img.url !== null);
      case 4:
        return title.trim().length > 0 && description.trim().length > 0;
      case 5:
        return Number(pricePerHour) >= 49;
      case 6:
        return (
          ownerInfo.fullName.trim().length > 0 &&
          ownerInfo.phone.trim().length > 0 &&
          ownerInfo.idNumber.trim().length > 0
        );
      default:
        return true;
    }
  })();

  const handleAddFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setImages((prev) => [...prev, { id, url: null, progress: 0, error: null }]);
      uploadListingImage(file, user.uid, listingDraftId, (pct) => {
        setImages((prev) => prev.map((img) => (img.id === id ? { ...img, progress: pct } : img)));
      })
        .then((url) => {
          setImages((prev) => prev.map((img) => (img.id === id ? { ...img, url, progress: 100 } : img)));
        })
        .catch((err) => {
          console.error('Image upload failed:', err);
          setImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, error: 'Upload failed — try again' } : img)),
          );
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

  const handleSubmit = async () => {
    if (!propertyType) return;
    setSubmitting(true);
    try {
      const id = await submitListing(
        {
          propertyType,
          address,
          area,
          maxGuests,
          roomSizeSqft: roomSizeSqft ? Number(roomSizeSqft) : null,
          amenities,
          imageUrls: images.map((img) => img.url).filter((u): u is string => u !== null),
          title,
          description,
          pricePerHour: Number(pricePerHour),
          ownerInfo,
        },
        user,
      );
      setSubmittedId(id);
    } catch (err) {
      console.error('Listing submit failed:', err);
      window.alert('Something went wrong submitting your listing — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepInfo = STEP_TITLES[step];

  const footer = (
    <button
      type="button"
      disabled={!canProceed || submitting}
      onClick={step === STEP_TITLES.length - 1 ? handleSubmit : () => setStep((s) => s + 1)}
      className="w-full rounded-full bg-pink-cta py-3 text-sm font-semibold text-white shadow disabled:opacity-40"
    >
      {step === STEP_TITLES.length - 1 ? (submitting ? 'Submitting…' : 'Submit for review') : 'Next'}
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
      {step === 0 && <StepPropertyType value={propertyType} onChange={setPropertyType} />}
      {step === 1 && (
        <StepLocation address={address} onAddressChange={setAddress} area={area} onAreaChange={setArea} />
      )}
      {step === 2 && (
        <StepDetails
          maxGuests={maxGuests}
          onMaxGuestsChange={setMaxGuests}
          roomSizeSqft={roomSizeSqft}
          onRoomSizeChange={setRoomSizeSqft}
          amenities={amenities}
          onToggleAmenity={(key) => setAmenities((prev) => ({ ...prev, [key]: !prev[key] }))}
        />
      )}
      {step === 3 && (
        <StepPhotos images={images} onAddFiles={handleAddFiles} onRemove={handleRemoveImage} onMove={handleMoveImage} />
      )}
      {step === 4 && (
        <StepTitleDescription
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
        />
      )}
      {step === 5 && <StepPricing pricePerHour={pricePerHour} onChange={setPricePerHour} />}
      {step === 6 && (
        <StepOwnerVerification value={ownerInfo} onChange={(patch) => setOwnerInfo((prev) => ({ ...prev, ...patch }))} />
      )}
      {step === 7 && propertyType && (
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
          ownerInfo={ownerInfo}
        />
      )}
    </WizardShell>
  );
}
