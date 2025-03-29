
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  //console.log(session)
  return (
    <div className="flex justify-center flex-col items-center p-10"> 
    {session.user.image && <img src={session.user.image} alt="hola" className=" rounded-full h-36 w-36 "/>}
      <h2 className="text-4xl font-bold text-center">Bienvenido {session.user.name}</h2>
      <h2>{session.user.id}</h2>
    </div>
  )
}
