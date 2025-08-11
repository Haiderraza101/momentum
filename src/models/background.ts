import { activebackground, backgroundItem, UserFavoriteBackground } from "@/types/background";
import { validate, validators } from "@/utils/validator";
import db from '../../lib/db';
export class Background {
  public static async FavoriteBackground(FavoriteBackground: UserFavoriteBackground) {
    const { userid, backgroundurl,backgrounddescription } = FavoriteBackground;

    const [success, validated] = validate({ userid }, { userid: validators.id });

    if (!success) {
      const error = validated.issues[0];
      throw new Error(`${error.message}`);
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
   SELECT b.id, b.imageurl, b.description, b.isactive
    FROM backgrounds b
    JOIN favoritebackgrounds fb ON b.id = fb.backgroundid
    WHERE fb.userid = $1
  `;

  const result = await db.query(query, [userid]);
  return result.rows; 
}

public static async setActiveBackground(body: activebackground) {
  const [success, validated] = validate(
    {
      userid: body.userid,
      backgroundid: body.backgroundid,
    },
    {
      userid: validators.id,
      backgroundid: validators.id,
    }
  );

  if (!success) {
    const error = validated.issues[0];
    throw new Error(`Error in validation ${error.message}`);
  }
  const deactivateQuery = `
    UPDATE backgrounds
    SET isactive = false
    WHERE id IN (
      SELECT backgroundid
      FROM favoritebackgrounds
      WHERE userid = $1
    )
  `;
  await db.query(deactivateQuery, [body.userid]);
  const activateQuery = `
    UPDATE backgrounds
    SET isactive = true
    WHERE id = $1
    AND id IN (
      SELECT backgroundid
      FROM favoritebackgrounds
      WHERE userid = $2
    )
  `;
  await db.query(activateQuery, [body.backgroundid, body.userid]);

  return { success: true, message: "Background set as active" };
}

public static async setInactiveBackground(body: activebackground) {
  const [success, validated] = validate(
    {
      userid: body.userid,
      backgroundid: body.backgroundid,
    },
    {
      userid: validators.id,
      backgroundid: validators.id,
    }
  );

  if (!success) {
    const error = validated.issues[0];
    throw new Error(`Error in validation ${error.message}`);
  }

  const deactivateQuery = `
    UPDATE backgrounds
    SET isactive = false
    WHERE id = $1
    AND id IN (
      SELECT backgroundid
      FROM favoritebackgrounds
      WHERE userid = $2
    )
  `;

  await db.query(deactivateQuery, [body.backgroundid, body.userid]);

  return { success: true, message: "Background set as inactive" };
}


public static async getActiveBackground(userid: number) {
  const [success, validated] = validate(
    { userid },
    { userid: validators.id }
  );

  if (!success) {
    const error = validated.issues[0];
    throw new Error(`Error in validation ${error.message}`);
  }

  const query = `
    SELECT b.id, b.imageurl, b.description, b.isactive
    FROM backgrounds b
    JOIN favoritebackgrounds fb ON b.id = fb.backgroundid
    WHERE fb.userid = $1 AND b.isactive = true
    LIMIT 1
  `;

  const result = await db.query(query, [userid]);

  if (result.rows.length === 0) {
    return { success: false, message: "No active background found" };
  }

  return { success: true, background: result.rows[0] };
}


public static async removeFavoriteBackground(userid: number, backgroundid: number) {
  const [success, validated] = validate(
    { userid, backgroundid },
    { userid: validators.id, backgroundid: validators.id }
  );

  if (!success) {
    const error = validated.issues[0];
    throw new Error(`Validation error: ${error.message}`);
  }

  const deleteQuery = `
    DELETE FROM favoritebackgrounds
    WHERE userid = $1 AND backgroundid = $2
  `;

  await db.query(deleteQuery, [userid, backgroundid]);

  return { success: true, message: "Background removed from favorites" };
}

}
