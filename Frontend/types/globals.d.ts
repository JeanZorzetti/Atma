// Global type declarations for external modules

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number
  }

  export const CheckCircle: FC<IconProps>
  export const Star: FC<IconProps>
  export const Users: FC<IconProps>
  export const TrendingUp: FC<IconProps>
  export const Shield: FC<IconProps>
  export const Zap: FC<IconProps>
  export const ArrowRight: FC<IconProps>
  export const DollarSign: FC<IconProps>
  export const Heart: FC<IconProps>
  export const Smile: FC<IconProps>
  export const Clock: FC<IconProps>
  export const BarChart3: FC<IconProps>
  export const Award: FC<IconProps>
  export const Menu: FC<IconProps>
  export const X: FC<IconProps>
  export const ChevronDown: FC<IconProps>
  export const Facebook: FC<IconProps>
  export const Instagram: FC<IconProps>
  export const Linkedin: FC<IconProps>
  export const Mail: FC<IconProps>
  export const Phone: FC<IconProps>
  export const MapPin: FC<IconProps>
  export const Play: FC<IconProps>
  export const Download: FC<IconProps>
  export const Monitor: FC<IconProps>
  export const Smartphone: FC<IconProps>
  export const BookOpen: FC<IconProps>
  export const Headphones: FC<IconProps>
  export const CheckCircle: FC<IconProps>
  export const CreditCard: FC<IconProps>
  export const Calendar: FC<IconProps>
  export const PieChart: FC<IconProps>
  // Add other lucide icons as needed
}

declare module 'next/link' {
  import { ComponentType, AnchorHTMLAttributes, ReactNode } from 'react'
  
  export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string
    as?: string
    replace?: boolean
    scroll?: boolean
    shallow?: boolean
    passHref?: boolean
    prefetch?: boolean
    locale?: string | false
    children: ReactNode
  }

  const Link: ComponentType<LinkProps>
  export default Link
}