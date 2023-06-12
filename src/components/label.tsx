export const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) => (
  <label className="type-md-tight text-body-and-labels block" htmlFor={htmlFor}>
    {children}
  </label>
);
