import Link from "next/link";

const LinkOption = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => (
  <Link className="underline text-informational focusable" href={href}>
    {children}
  </Link>
);

export default function MultiselectOptionsPage() {
  return (
    <ul>
      <li>
        <LinkOption href="/multiselect/options/a">View Option A</LinkOption>
      </li>
      <li>
        <LinkOption href="/multiselect/options/b">View Option B</LinkOption>
      </li>
      <li>
        <LinkOption href="/multiselect/options/c">View Option C</LinkOption>
      </li>
      <li>
        <LinkOption href="/multiselect/options/d">View Option D</LinkOption>
      </li>
    </ul>
  );
}
