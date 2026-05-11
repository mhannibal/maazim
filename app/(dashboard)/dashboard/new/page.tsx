import { createInvitationAction } from './actions'

export default function NewInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-2xl">
      <div className="mb-8">
        <h1
          className="text-3xl text-[#2D1B0E]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          New Invitation
        </h1>
        <p className="text-sm text-[#2D1B0E]/50 mt-1">
          Tell us about your special day.
        </p>
      </div>

      <form action={createInvitationAction} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field name="bride" label="Bride's name" placeholder="Sarah" required />
          <Field name="groom" label="Groom's name" placeholder="Thomas" required />
        </div>

        <Field name="date" label="Wedding date" type="date" required />
        <Field name="venue" label="Venue name" placeholder="Château de Fontainebleau" />
        <Field name="city" label="City / Location" placeholder="Paris, France" />

        <div className="pt-2">
          <button
            type="submit"
            className="px-7 py-3 rounded-lg bg-[#2D1B0E] text-[#FAF7F2] text-sm font-medium hover:bg-[#C9A96E] transition-colors"
          >
            Create invitation →
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
}: {
  name: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[#2D1B0E]/70 mb-1.5"
      >
        {label}
        {required && <span className="text-[#C9A96E] ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-[#C9A96E]/30 bg-[#FAF7F2] text-[#2D1B0E] placeholder:text-[#2D1B0E]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E] transition-colors"
      />
    </div>
  )
}
