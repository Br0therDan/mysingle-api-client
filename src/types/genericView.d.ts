// src/types/genericView.d.ts

import { LucideIcon } from 'lucide-react'

export type ViewType = 'dashboard' | 'list' | 'detail'

export type SelectOption = {
  value: string
  label: string
}

export type Field<T> = {
  name: Path<T>
  label: string
  type: 'text' | 'number' | 'email' | 'date' | 'select'
  validation?: z.ZodTypeAny
  options?: SelectOption[]
}

export type DashboardCard = {
  title: string
  value: string | number
  icon: React.ReactNode
}

export type GenericViewProps<T extends z.ZodTypeAny> = {
  schema: T
  fields: Field<z.infer<T>>[]
  viewType: ViewType
  data: z.infer<T> | z.infer<T>[]
  onSave?: (data: z.infer<T>) => void
  dashboardCards?: DashboardCard[]
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon
}

export interface UserMenuItem {
  label: string;
  onClick: () => void;
}

export interface LayoutConfig {
  siteName: string;
  logo: string;
  navItems: NavItem[];
  userMenuItems: UserMenuItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  font?: any; // Adjust type if necessary
}