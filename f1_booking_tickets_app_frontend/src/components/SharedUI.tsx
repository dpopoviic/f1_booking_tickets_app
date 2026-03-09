type RedBtnProps = {
  onClick?: () => void
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  small?: boolean
}

export const RedBtn = ({
  onClick,
  children,
  type = 'button',
  small = false,
}: RedBtnProps) => (
  <button
    type={type}
    onClick={onClick}
    className={`flex items-center gap-1.5 font-semibold text-white rounded-md transition-all duration-200 ${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
    style={{ backgroundColor: '#E8102A' }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b50d22')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E8102A')}
  >
    {children}
  </button>
)
type GhostBtnProps = {
  onClick?: () => void
  children: React.ReactNode
  small?: boolean
}

export const GhostBtn = ({
  onClick,
  children,
  small = false,
}: GhostBtnProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 font-semibold text-neutral-200 border border-neutral-700 rounded-md bg-transparent hover:border-neutral-500 transition-colors ${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
  >
    {children}
  </button>
)
type FieldProps = {
  label: string
  children: React.ReactNode
}

export const Field = ({ label, children }: FieldProps) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
      {label}
    </label>
    {children}
  </div>
)
type InputProps = {
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  className?: string
}

export const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}: InputProps) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full bg-neutral-900 border border-neutral-700 rounded-md px-3.5 py-2.5 text-sm text-neutral-100 outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600 ${className}`}
  />
)
