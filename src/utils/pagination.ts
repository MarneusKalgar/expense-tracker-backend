interface PaginationParams {
  page?: number;
  perPage?: number;
}

interface PaginationResult {
  currentPage: number;
  limit: number;
  offset: number;
}

export const getPagination = ({ page, perPage }: PaginationParams): PaginationResult => {
  const parsedPage = Number(page);
  const parsedLimit = Number(perPage);

  const resolvedPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const resolvedLimit = isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;
  const offset = (resolvedPage - 1) * resolvedLimit;

  return { currentPage: resolvedPage, limit: resolvedLimit, offset };
};
