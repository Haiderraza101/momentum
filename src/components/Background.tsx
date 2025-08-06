import { fetchBackgroundfromUnsplash } from '@/lib/api/unsplash';
import Links from '../components/Links';
import Weather from '../components/Weather';
import Time from './Time';
import QuotesComponent from './Quotes';

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
      
    
      <Time></Time>
     <QuotesComponent></QuotesComponent>
    
      
    </div>
  )
}