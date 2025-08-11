import { UserFavoriteQuotes } from "@/types/quotes";
import { validate, validators } from "@/utils/validator";
import db from '../../lib/db';

export class Quotes{
  public static async FavoriteQuotes(FavoriteQuote:UserFavoriteQuotes){
    const {userid,quotes,author}=FavoriteQuote;
     console.log('Favorite Quote Details --------------',userid,quotes,author);
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
}