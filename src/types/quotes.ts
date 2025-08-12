export interface Quotes{
    quote:string;
    author:string
}
export interface UserFavoriteQuotes{
    userid:number;
    quotes:string,
    author:string
}
export interface quoteitem{
    id:number;
    text:string;
    author:string;
    isactive:boolean;
}

export interface quotedata{
    quote:string;
    author:string;
}
export interface activequote{
    userid:number;
    quoteid:number;
}