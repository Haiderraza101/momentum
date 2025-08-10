import { fetchBackgroundfromUnsplash } from '@/lib/api/unsplash';
import Links from '../components/Links';
import Weather from '../components/Weather';
import Time from './Time';
import QuotesComponent from './Quotes';
import Menu from './Menu';
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
     <div className="flex justify-between items-start px-4 pt-4">
  <Links />
  <div className="flex gap-2">
    <Menu backgroundurl={Background.url}
    backgrounddescription={Background.description}/>
    <Weather />
  </div>
</div>
    <div className='relative top-50 text-center'>

      <Time></Time>
     
     <QuotesComponent></QuotesComponent>
    </div>
      
    </div>
  )
}