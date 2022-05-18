export class Helper {
  static title = '全局';
  static substring(str: string, start: number, end: number) {
    if (end) {
      return str.substring(start, end);
    } else {
      return str.substring(start);
    }
  }
}
