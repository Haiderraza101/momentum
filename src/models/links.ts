import { LinksBody } from '@/types/links';
import db from '../../lib/db'
export class Links{
  public static async sumbitLinks(body:LinksBody){
    
   const query = `
  INSERT INTO links (title, url)
  VALUES ($1, $2)
  ON CONFLICT (title, url)
  DO UPDATE SET
    title = excluded.title,
    url   = excluded.url
  RETURNING id
`;


    await db.query(query,[body.title,body.link]);


    return {
      success:true
    }
  }

  public static async getLinks() {
  const query = `SELECT id, title, url FROM links ORDER BY id DESC`;
  const { rows } = await db.query(query);
  return rows;
}
}