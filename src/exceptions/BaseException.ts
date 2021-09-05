export default class BaseException {
  constructor(args: any = null) {
    Error.apply(this, args);
  }
}