import { SellForm } from './SellForm';

export default function SellPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold">Submit your listing</h1>
        <p className="text-sm text-slate-300">
          Complete the form below and our team will review your submission. Required
          fields are marked with an asterisk.
        </p>
      </div>
      <SellForm />
    </div>
  );
}
