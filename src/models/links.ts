import { LinksBody } from '@/types/links';
import db from '../../lib/db';

export class Links {
  public static async sumbitLinks(body: LinksBody & { userid: number }) {
    const query = `
      INSERT INTO links (userid, title, url)
      VALUES ($1, $2, $3)
      ON CONFLICT (userid, title, url)
      DO UPDATE SET
        title = excluded.title,
        url   = excluded.url
      RETURNING id
    `;

    await db.query(query, [body.userid, body.title, body.url]);
    return { success: true };
  }

  public static async getLinks(userid: number) {
    const query = `
      SELECT id, title, url
      FROM links
      WHERE userid = $1
      ORDER BY id DESC
    `;
    const { rows } = await db.query(query, [userid]);
    return rows;
  }
}
