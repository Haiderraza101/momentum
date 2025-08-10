import { backgroundItem, UserFavoriteBackground } from "@/types/background";
import { validate, validators } from "@/utils/validator";
import db from '../../lib/db';
export class Background {
  public static async FavoriteBackground(FavoriteBackground: UserFavoriteBackground) {
    const { userid, backgroundurl,backgrounddescription } = FavoriteBackground;

    const [success, validated] = validate({ userid }, { userid: validators.id });

    if (!success) {
      const error = validated.issues[0];
      throw new Error(`Error in validation: ${error.message}`);
    }

    const insertBackgroundQuery = `
  INSERT INTO backgrounds (imageurl, description)
  VALUES ($1, $2)
  ON CONFLICT (imageurl)
  DO UPDATE SET description = EXCLUDED.description
  RETURNING id
`;
    const backgroundResult = await db.query(insertBackgroundQuery, [backgroundurl,backgrounddescription]);
    const backgroundid = backgroundResult.rows[0].id;

    const insertFavoriteQuery = `
      INSERT INTO favoritebackgrounds (userid, backgroundid)
      VALUES ($1, $2)
      ON CONFLICT (userid, backgroundid) DO NOTHING
    `;
    await db.query(insertFavoriteQuery, [userid, backgroundid]);

      console.log('Favorite background inserted successfully');
return { success: true };
  }


public static async getFavoriteBackground(userid: number): Promise<backgroundItem[]> {
  const [success, validated] = validate(
    { userid },
    { userid: validators.id }
  );

  if (!success) {
    const error = validated.issues[0];
    throw new Error(`Error in validation ${error.message}`);
  }

  const query = `
    SELECT b.imageurl, b.description
    FROM backgrounds b
    JOIN favoritebackgrounds fb ON b.id = fb.backgroundid
    WHERE fb.userid = $1
  `;

  const result = await db.query(query, [userid]);
  return result.rows; 
}

}
