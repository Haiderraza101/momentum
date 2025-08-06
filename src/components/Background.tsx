import { fetchBackgroundfromUnsplash } from '@/lib/api/unsplash';
import Links from '../components/Links';
import Weather from '../components/Weather';

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
      <div className='flex justify-between'>
        <Links></Links>
      <Weather></Weather>
      </div>
    
    </div>
  )
}