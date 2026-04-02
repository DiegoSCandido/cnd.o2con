import o2conLogo from '@/assets/o2con-logo.png'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
  }

  return (
    <div className={cn('flex items-center', className)}>
      <img
        src={o2conLogo}
        alt="O2con Soluções Contábeis"
        className={cn('object-contain', sizeClasses[size])}
      />
    </div>
  )
}

