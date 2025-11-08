// Standard API response format
export const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const errorResponse = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  };
};

// Pagination helper
export const paginate = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
