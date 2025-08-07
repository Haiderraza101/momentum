import {NextResponse} from 'next/server';
import db from '../../../../lib/db';
export async function GET(){

  try{
    const result = await db.query(
      `
      Select * from users`
    );

    return NextResponse.json(result.rows);
  }
  catch(err){
    console.error(err);
    return NextResponse.json({
      error:"Server Error"
    },{
      status:500
    })
  }
}