interface ContentProps {
  title: string;
  children?: React.ReactNode;
}
export default function Content ({title, children}: ContentProps) {
  return (
    <main className={`bg-gray-800 text-white p-8 flex-1 overflow-y-auto`}>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {children || <p>Mon super contenu</p>}
    </main>
  )
}