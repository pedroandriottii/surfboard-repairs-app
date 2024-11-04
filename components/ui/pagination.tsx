import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

type PaginationContextType = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationContext = React.createContext<PaginationContextType | null>(null);

type PaginationProviderProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
};

const PaginationProvider: React.FC<PaginationProviderProps> = ({ currentPage, totalPages, onPageChange, children }) => {
  return (
    <PaginationContext.Provider value={{ currentPage, totalPages, onPageChange }}>
      {children}
    </PaginationContext.Provider>
  );
};

const usePagination = () => {
  const context = React.useContext(PaginationContext);
  if (!context) throw new Error("usePagination must be used within a PaginationProvider");
  return context;
};

// Helper function to generate pages with ellipsis
const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const pageNumbers: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
};

// Pagination components
const Pagination = ({ children, currentPage, totalPages, onPageChange, className, ...props }: PaginationProviderProps & React.ComponentProps<"nav">) => (
  <PaginationProvider currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}>
    <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props}>
      {children}
    </nav>
  </PaginationProvider>
);

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> & React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        size,
      }),
      isActive ? "bg-primary text-white" : "bg-muted text-primary",
      "px-3 py-1 rounded-md transition-colors",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { currentPage, onPageChange } = usePagination();
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 bg-muted text-primary", className)}
      onClick={(e) => {
        e.preventDefault();
        if (currentPage > 1) onPageChange(currentPage - 1);
      }}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
    </PaginationLink>
  )
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const { currentPage, totalPages, onPageChange } = usePagination();
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 bg-muted text-primary", className)}
      onClick={(e) => {
        e.preventDefault();
        if (currentPage < totalPages) onPageChange(currentPage + 1);
      }}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center text-muted", className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationNumbers = () => {
  const { currentPage, totalPages, onPageChange } = usePagination();
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <>
      {pageNumbers.map((page, index) => (
        <PaginationItem key={index}>
          {page === "..." ? (
            <PaginationEllipsis />
          ) : (
            <PaginationLink
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                if (typeof page === "number") onPageChange(page);
              }}
            >
              {page}
            </PaginationLink>
          )}
        </PaginationItem>
      ))}
    </>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationNumbers,
};
