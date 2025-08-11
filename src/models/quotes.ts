import { activequote, quoteitem, UserFavoriteQuotes } from "@/types/quotes";
import { validate, validators } from "@/utils/validator";
import db from '../../lib/db';

export class Quotes{
  public static async FavoriteQuotes(FavoriteQuote:UserFavoriteQuotes){
    const {userid,quotes,author}=FavoriteQuote;
    const [success,validated]=validate({
      userid
    },{
      userid:validators.id
    });

    if (!success){
      const error = validated.issues[0];
      throw new Error(`${error.message}`);
    }

    const insertQuoteQuery = `
  INSERT INTO quotes (text, author)
  VALUES ($1, $2)
  ON CONFLICT (text, author)
  DO UPDATE SET text = EXCLUDED.text,
                author = EXCLUDED.author
  RETURNING id
`;

const queryresult = await db.query(insertQuoteQuery,[quotes,author]);
const quoteid = queryresult.rows[0].id;
const insertFavoriteQuoteQuery = `
insert into favoritequotes(userid,quoteid)
values ($1,$2)
on conflict (userid,quoteid) do nothing

`

const result = await db.query(insertFavoriteQuoteQuery,[userid,quoteid]);

return {
  success:true
};
  }

  public static async getFavoriteQuote(userid:number):Promise<quoteitem[]>{
    
    const [success,validated]=validate({
      userid
    },{
      userid:validators.id
    });

    if (!success){
      const error = validated.issues[0];
      throw new Error(`${error.message}`);
    }

    const query = `Select q.id,q.text,q.author,q.isactive from quotes q join favoritequotes fq on q.id = fq.quoteid where fq.userid = $1`;

    const result = await db.query(query,[userid]);

    return result.rows;
  }

  public static async getActiveQuote(userid:number){
    const [success,validated]=validate({
      userid
    },{
      userid:validators.id
    });

    if (!success){
      const error = validated.issues[0];
      throw new Error(`${error.message}`);
    }

    const query = `SELECT q.id, q.text, q.author, q.isactive
    FROM quotes q
    JOIN favoritequotes fq ON q.id = fq.quoteid
    WHERE fq.userid = $1 AND q.isactive = true
    LIMIT 1`;

    const result = await db.query(query,[userid]);
     if (result.rows.length === 0) {
    return { success: false, message: "No active quote found" };
  }

   return { success: true, quote: result.rows[0] };
  }

  public static async setActiveQuote(body:activequote){
   const [success,validated]=validate({
    userid:body.userid,
    quoteid:body.quoteid
   },{
    userid:validators.id,
    quoteid:validators.id
   });

   if (!success){
    const error = validated.issues[0];
    throw new Error(`${error.message}`);
   }

   const deactivequery = `Update quotes 
   set isactive=false where id in (
   Select quoteid from favoritequotes where userid=$1)`;

   await db.query(deactivequery,[body.userid]);


   const activateQuery = `Update quotes 
   set isactive=true 
   where id = $1
   and id in (
   Select quoteid from favoritequotes where userid = $2)`;

   await db.query(activateQuery,[body.quoteid,body.userid]);

   return {
    success:true,message:'Quote set as active '
   }
  }
}