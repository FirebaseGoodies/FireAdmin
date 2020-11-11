
export interface Menu {
  id?: string;
  name: string;
  lang: string;
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  url: string;
  //icon?: string;
  childrens: MenuItem[];
}
