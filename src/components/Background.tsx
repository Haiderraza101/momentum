import { fetchBackgroundfromUnsplash } from '@/lib/api/unsplash';
import Links from '../components/Links';


export default async function Background(){
  const Background = await fetchBackgroundfromUnsplash();

  return (
    <div
    style={{
      backgroundImage:`url(${Background.url})`,
      backgroundSize:"cover",
      backgroundPosition:"center",
      height:"100vh"
    }}>
      <Links></Links>
    </div>
  )
}