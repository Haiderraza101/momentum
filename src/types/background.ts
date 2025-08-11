export interface Background{
  id:number;
  url:string;
  description:string;
  authorName:string;
  authorLink:string;
}

export interface MenuProp{
  backgroundurl:string
  backgrounddescription:string;
}

export interface UserFavoriteBackground extends MenuProp{
userid:number;
}

export interface backgroundItem{
  id:number;
  imageurl:string;
  description:string | null;
  isactive:boolean;
}