import Link from "next/link"

export default function StoreNav() {
  return (
        <aside className="h-screen w-[80px] bg-slate-900 border-r-2 border-slate-700 overflow-y-auto scrollbar-thin scroll-m-2">
            <ul className="flex px-2 items-center flex-col text-xl text-center">
                <li className="mt-5 h-10 text-slate-300 rounded-sm w-full hover:bg-slate-400 hover:text-white transition-all duration-500">
                    <Link href="/">Home</Link>
                </li>
                
            </ul>
        </aside>
  )
}
