import { format } from 'silly-datetime';
import { extname } from 'path';
export class Helper {
  static title = '全局';
  static substring(str: string, start: number, end: number) {
    if (end) {
      return str.substring(start, end);
    } else {
      return str.substring(start);
    }
  }

  static formatTime(params) {
    return format(params, 'YYYY-MM-DD HH:mm');
  }
  static formatImg(dir, width, height) {
    height = height || width;
    return dir + '_' + width + 'x' + height + extname(dir);
  }
}
