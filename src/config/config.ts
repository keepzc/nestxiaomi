export class Config {
  static adminPath = 'keep';
  static sessionMaxAge = 30 * 1000 * 60;
  static uploadDir = 'upload';
  static jimpSize = [
    { width: 100, height: 100 },
    { width: 200, height: 200 },
    { width: 400, height: 400 },
  ];
  static redisOptions = {
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0,
  };
}
