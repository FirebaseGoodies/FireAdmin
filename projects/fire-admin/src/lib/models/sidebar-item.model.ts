
export interface SidebarItem {
  label: string;
  icon?: string;
  routerLink?: string | string[];
  childrens?: SidebarItemChildren[];
  isActive?: boolean;
  isHidden?: () => boolean
}

export interface SidebarItemChildren extends Omit<SidebarItem, 'icon' | 'childrens' | 'isActive' | 'isHidden'> { }
