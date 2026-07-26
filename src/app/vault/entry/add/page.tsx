'use client';
import BackButton from '@/components/common/BackButton';
import AddEntryForm from '@/components/forms/AddEntryForm';

export default function AddEntryPage() {
  return (
    <div className="w-full h-full">
      <div className="pl-8 pt-8">
        <BackButton />
      </div>
      <div className="w-10/12 max-w-md mx-auto py-20">
        <AddEntryForm />
      </div>
    </div>
  );
}
