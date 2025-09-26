interface HeaderProps {
  title: string;
}
export default function Header ({title}: HeaderProps){
  return (
    <header className={`bg-gray-800 text-white border-b-2 border-gray-600 p-4 h-16 flex items-center justify-center`}>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  )
}
