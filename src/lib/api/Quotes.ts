import { Quotes } from "@/types/quotes";
export async function fetchQuotes(): Promise<Quotes> {
  const res = await fetch('http://localhost:3000/api/quotes');

  if (!res.ok) {
    throw new Error("Error in fetching the Quotes");
  }

  const data = await res.json();

  return {
    quote: data.quote,
    author: data.author,
  };
}
