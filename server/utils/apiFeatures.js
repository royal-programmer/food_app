class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  ["search"]() {
    const searchQuery = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: "i"
      }
    } : {};
    this.query = this.query.find({
      ...searchQuery
    });
    return this;
  }

  ["filter"]() {
    const queryCopy = {
      ...this.queryStr
    };
    const excludeFields = ["keyword", "limit", "page"];
    excludeFields.forEach(el => delete queryCopy[el]);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => "$" + match);
    this.query = this.query.find(JSON.parse(queryStr));

    if (this.queryStr.sortBy) {
      const sortBy = this.queryStr.sortBy.toLowerCase();
      if (sortBy === "ratings") {
        sortQuery = {
          ratings: -1
        };
      } else if (sortBy === "reviews") {
        sortQuery = {
          numOfReviews: -1
        };
      }
    }
    this.query = this.query.sort(sortQuery);
    return this;
  }
  
  ["pagination"](resultsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }

  ["sort"]() {
    if (this.queryStr.sortBy) {
      const sortBy = this.queryStr.sortBy.toLowerCase();
      let sortQuery = {};
      if (sortBy === "ratings") {
        sortQuery = {
          ratings: -1
        };
      } else if (sortBy === "reviews") {
        sortQuery = {
          numOfReviews: -1
        };
      }
      this.query = this.query.sort(sortQuery);
    }
    return this;
  }
}
module.exports = APIFeatures;