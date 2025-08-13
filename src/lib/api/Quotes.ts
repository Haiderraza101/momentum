import { Quotes } from "@/types/quotes";
export default async function fetchQuotes(): Promise<Quotes> {
  const res = await fetch('/api/quotes');

  if (!res.ok) {
    throw new Error("Error in fetching the Quotes");
  }

  const data = await res.json();

  return {
    quote: data.quote,
    author: data.author,
  };
}
