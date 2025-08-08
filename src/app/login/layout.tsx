import { ReactNode } from "react"


interface Props {
  children:ReactNode;
}
export default function LoginLayout({children}:Props){
  return (
    <div>
    {children}
    </div>
  )
}