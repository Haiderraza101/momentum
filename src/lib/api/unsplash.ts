import { Background } from "@/types/background";

export async function fetchBackgroundfromUnsplash():Promise<Background>{
const res = await fetch(
`https://api.unsplash.com/photos/random?query=dark&orientation=landscape&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`,
  {
    next: { revalidate: 60 }
  }
);

  if (!res.ok){
    throw new Error('Failed to fetch Background');
  }

  const data = await res.json();

  return {
    id:data.id,
    url:data.urls.full,
    description:data.alt_description || "Nature Background",
    authorName:data.user.name,
    authorLink:data.user.links.html
  }
}