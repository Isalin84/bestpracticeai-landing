import React from 'react'

type Variant = 'primary' | 'secondary' | 'primary-outline'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  as?: 'button' | 'a'
  href?: string
}

export function Button({ variant = 'primary', as = 'button', href, children, className = '', ...props }: ButtonProps) {
  const cls = `btn-${variant} ${className}`
  if (as === 'a') {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
