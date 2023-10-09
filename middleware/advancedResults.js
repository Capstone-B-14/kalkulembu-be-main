const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const advancedResults = (model, includeModel) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create Prisma query
  query = prisma[model].findMany({
    where: { ...reqQuery },
    select: req.query.select ? { ...req.query.select } : undefined,
    orderBy: req.query.sort ? { [req.query.sort]: "asc" } : undefined,
    skip: req.query.page ? (req.query.page - 1) * req.query.limit : undefined,
    take: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
  });

  // Include related model
  if (includeModel) {
    query = query.include({ [includeModel]: true });
  }

  try {
    // Execute the query
    const results = await query;
    // Get total count
    const totalCount = await prisma[model].count();

    // Pagination
    const pagination = {};
    if (req.query.page && req.query.limit) {
      const totalPages = Math.ceil(totalCount / req.query.limit);
      pagination.totalPages = totalPages;
      if (parseInt(req.query.page, 10) < totalPages) {
        pagination.next = {
          page: parseInt(req.query.page, 10) + 1,
          limit: req.query.limit,
        };
      }
      if (parseInt(req.query.page, 10) > 1) {
        pagination.prev = {
          page: parseInt(req.query.page, 10) - 1,
          limit: req.query.limit,
        };
      }
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      totalCount,
      pagination,
      data: results,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = advancedResults;
