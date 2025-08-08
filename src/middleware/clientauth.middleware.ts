export async function getaccountdetails(){

  const res = await fetch("/api/account");
  const data = await res.json();
  return data;
}
