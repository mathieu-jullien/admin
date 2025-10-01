interface ContentProps {
  title: string;
  children?: React.ReactNode;
}
export default function Content({ title, children }: ContentProps) {
  return (
    <main className={`bg-gray-800 text-white p-8 flex-1 overflow-y-auto`}>
      {children || <p>{title}</p>}
    </main>
  );
}
