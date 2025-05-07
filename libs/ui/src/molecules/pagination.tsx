import { useState, type HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../utils";
import { Icon } from "../atoms/icon";
import { LinkButton } from "../atoms/link-button";

const pagination = tv({
  slots: {
    base: "",
    list: ["inline-flex items-center gap-pagination-list"],
    item: "grid cursor-pointer",
    link: [
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-pagination-ring focus-visible:ring-offset-2",
      "border-(length:--border-pagination-width) border-pagination-border rounded-pagination",
      "aspect-square text-pagination-size h-pagination",
      "data-[disabled]:text-pagination-fg-disabled data-[disabled]:hover:bg-transparent",
    ],
    ellipsis: "",
  },
  compoundSlots: [
    {
      slots: ["link", "ellipsis"],
      className: [
        "inline-flex items-center justify-center",
        "transition-colors duration-200",
        "text-pagination-fg",
      ],
    },
  ],
  variants: {
    variant: {
      filled: {},
      outlined: {},
      minimal: {},
    },
  },
  defaultVariants: {
    variant: "filled",
  },
  compoundVariants: [
    {
      variant: "filled",
      className: {
        link: [
          "data-[current=true]:bg-pagination-active data-[current=true]:text-pagination-text-active data-[current=true]:border-pagination-border-active",
          "hover:bg-pagination-hover hover:border-pagination-border-hover",
          "data-[disabled]:border-pagination-border-disabled",
        ],
        nav: "hover:bg-pagination-hover hover:border-pagination-border-hover",
      },
    },
    {
      variant: "outlined",
      className: {
        link: [
          "data-[current=true]:text-pagination-outlined-fg-active data-[current=true]:border-pagination-border-active",
          "hover:border-pagination-border-hover hover:text-pagination-outlined-fg-active",
          "data-[disabled]:border-pagination-border-disabled",
        ],
        nav: "hover:border-pagination-border-hover",
      },
    },
    {
      variant: "minimal",
      className: {
        link: [
          "border-transparent",
          "data-[current=true]:bg-pagination-active data-[current=true]:text-pagination-fg-active",
          "hover:bg-pagination-hover",
        ],
        nav: "border-transparent hover:bg-pagination-hover",
      },
    },
  ],
});

export interface PaginationProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof pagination> {
  originPage: number;
  totalPages: number;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  originPage,
  totalPages,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  onPageChange,
  variant,
  className,
  ...props
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(originPage);
  const { base, list, link, item, ellipsis } = pagination({ variant });

  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const getSiblingPages = (
    currentPage: number,
    totalPages: number,
    siblingCount: number
  ) => {
    // Calculate how many slots we want to display in total
    const totalSiblingSlots = siblingCount * 2;

    // Calculate how many siblings we can show on left and right
    let leftSiblings = Math.min(currentPage - 1, siblingCount);
    let rightSiblings = Math.min(totalPages - currentPage, siblingCount);

    // If we have fewer siblings on one side, add more to the other side
    const remainingSiblings =
      totalSiblingSlots - (leftSiblings + rightSiblings);
    if (remainingSiblings > 0) {
      if (leftSiblings < siblingCount) {
        // We're close to the left edge, add more siblings to the right
        rightSiblings = Math.min(
          rightSiblings + remainingSiblings,
          totalPages - currentPage
        );
      } else {
        // We're close to the right edge, add more siblings to the left
        leftSiblings = Math.min(
          leftSiblings + remainingSiblings,
          currentPage - 1
        );
      }
    }

    // Calculate the range of pages to show
    const start = Math.max(2, currentPage - leftSiblings);
    const end = Math.min(totalPages - 1, currentPage + rightSiblings);

    // Generate the array of page numbers
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getSiblingPages(currentPage, totalPages, siblingCount);

  const showStartEllipsis = currentPage > 2 + siblingCount;
  const showEndEllipsis = currentPage < totalPages - (1 + siblingCount);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    if (page === validCurrentPage || page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  return (
    <nav className={base()}>
      <ul className={list()} aria-label="Pagination" {...props}>
        <li className={item()}>
          {showPrevNext && (
            <LinkButton
              className={link()}
              icon="token-icon-pagination-prev"
              onClick={() => {
                if (validCurrentPage === 1) return;
                handlePageClick(validCurrentPage - 1);
              }}
              disabled={validCurrentPage === 1}
            />
          )}
        </li>
        {showFirstLast && (
          <li className={item()}>
            <LinkButton
              className={link()}
              onClick={() => handlePageClick(1)}
              aria-current={1 === validCurrentPage ? "page" : undefined}
              data-current={1 === validCurrentPage}
            >
              1
            </LinkButton>
          </li>
        )}

        {showStartEllipsis && (
          <li className={item()}>
            <span className={ellipsis()} aria-hidden="true">
              <Icon icon="token-icon-pagination-ellipsis" size="current" />
            </span>
          </li>
        )}

        {visiblePages.map((page) => (
          <li className={item()}>
            <LinkButton
              key={page}
              className={link()}
              onClick={() => handlePageClick(page)}
              aria-current={page === validCurrentPage ? "page" : undefined}
              data-current={page === validCurrentPage}
            >
              {page}
            </LinkButton>
          </li>
        ))}

        {showEndEllipsis && (
          <li className={item()}>
            <span className={ellipsis()} aria-hidden="true">
              <Icon icon="token-icon-pagination-ellipsis" size="current" />
            </span>
          </li>
        )}

        {showFirstLast && (
          <li className={item()}>
            <LinkButton
              className={link()}
              onClick={() => handlePageClick(totalPages)}
              aria-current={
                totalPages === validCurrentPage ? "page" : undefined
              }
              data-current={totalPages === validCurrentPage}
            >
              {totalPages}
            </LinkButton>
          </li>
        )}
        <li className={item()}>
          {showPrevNext && (
            <LinkButton
              className={link()}
              icon="token-icon-pagination-next"
              onClick={() => {
                if (validCurrentPage === totalPages) return;
                handlePageClick(validCurrentPage + 1);
              }}
              disabled={validCurrentPage === totalPages}
            />
          )}
        </li>
      </ul>
    </nav>
  );
}
