interface PaginationParams {
  page?: number;
  perPage?: number;
}

interface PaginationResult {
  currentPage: number;
  limit: number;
  offset: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

export const getPagination = ({ page, perPage }: PaginationParams): PaginationResult => {
  const currentPage = Math.max(1, Number(page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_PER_PAGE, Math.max(1, Number(perPage) || DEFAULT_PER_PAGE));
  const offset = (currentPage - 1) * limit;

  return { currentPage, limit, offset };
};
