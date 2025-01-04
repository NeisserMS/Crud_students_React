export class AuthModel {
    constructor(params = {}) {
      this.username = params.username || "";
      this.password = params.password || "";
    }
  }
  