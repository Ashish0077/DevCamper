// This function is used to parse the query properly
const advanceQuery = (model, populate) => async (req, res, next) => {
  // extracting select fields and fixing the query
  let fields;
  if (req.query.select != undefined) {
    fields = req.query.select.split(",").join(" ");
    fields.trim();
    if (fields.length == 0 || fields == "all") {
      fields = undefined;
    }
    delete req.query.select;
  }

  // extracting sorting parameters
  let sortBy;
  if (req.query.sort) {
    sortBy = req.query.sort.split(",").join(" ");
    delete req.query.sort;
  } else {
    sortBy = "-createdAt";
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  if (req.query.page) delete req.query.page;
  if (req.query.limit) delete req.query.limit;

  // adding dollar operator for mongoose in the query
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  req.query = JSON.parse(queryStr);

  const results = await model
    .find(req.query)
    .populate(populate)
    .select(fields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit
    };
  }

  res.advanceQuery = {
    success: true,
    count: results.length,
    pagination: pagination,
    data: results
  };

  next();
};

module.exports = advanceQuery;
