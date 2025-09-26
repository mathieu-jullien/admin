interface SubNavProps {
  section?: string;
}
export default function SubNav({ section }: SubNavProps) {
  return (
    <nav
      className={`bg-gray-800 text-white border-b border-gray-600 p-4 h-12 flex items-center `}
    >
      <div className="flex space-x-6">{section}</div>
    </nav>
  );
}
