class APIFeatures {
  constructor(_0x5f07c0, _0x30724c) {
    this.query = _0x5f07c0;
    this.queryStr = _0x30724c;
  }
  ["search"]() {
    const _0x430af4 = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: "i"
      }
    } : {};
    this.query = this.query.find({
      ..._0x430af4
    });
    return this;
  }
  ["filter"]() {
    const _0x16b5e7 = {
      ...this.queryStr
    };
    const _0x11338f = ["keyword", "limit", "page"];
    _0x11338f.forEach(_0x512b34 => delete _0x16b5e7[_0x512b34]);
    let _0xd51f2d = JSON.stringify(_0x16b5e7);
    _0xd51f2d = _0xd51f2d.replace(/\b(gt|gte|lt|lte)\b/g, _0x5ce1a0 => "$" + _0x5ce1a0);
    this.query = this.query.find(JSON.parse(_0xd51f2d));
    if (this.queryStr.sortBy) {
      const _0x117d9e = this.queryStr.sortBy.toLowerCase();
      if (_0x117d9e === "ratings") {
        sortQuery = {
          ratings: -0x1
        };
      } else if (_0x117d9e === "reviews") {
        sortQuery = {
          numOfReviews: -0x1
        };
      }
    }
    this.query = this.query.sort(sortQuery);
    return this;
  }
  ["pagination"](_0xc7080f) {
    const _0x4326cd = Number(this.queryStr.page) || 0x1;
    const _0x460811 = _0xc7080f * (_0x4326cd - 0x1);
    this.query = this.query.limit(_0xc7080f).skip(_0x460811);
    return this;
  }
  ["sort"]() {
    if (this.queryStr.sortBy) {
      const _0x41a96c = this.queryStr.sortBy.toLowerCase();
      let _0xa4f813 = {};
      if (_0x41a96c === "ratings") {
        _0xa4f813 = {
          ratings: -0x1
        };
      } else if (_0x41a96c === "reviews") {
        _0xa4f813 = {
          numOfReviews: -0x1
        };
      }
      this.query = this.query.sort(_0xa4f813);
    }
    return this;
  }
}
module.exports = APIFeatures;