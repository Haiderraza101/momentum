export interface Background{
  id:string;
  url:string;
  description?:string;
  authorName:string;
  authorLink:string;
}

export interface MenuProp{
  backgroundurl:string
}

export interface UserFavoriteBackground extends MenuProp{
userid:number;
}

