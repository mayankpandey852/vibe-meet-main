import { cn } from "@/lib/utils";

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionContainer({
  children,
  className,
  id,
  ...props
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24 px-4 md:px-6 w-full max-w-7xl mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
