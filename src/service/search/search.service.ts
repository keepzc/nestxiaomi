import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
@Injectable()
export class SearchService {
  constructor(private elasticsearchService: ElasticsearchService) {}
  //查找
  async search(params) {
    return await this.elasticsearchService.search(params);
  }
  //增加 修改 删除
  async bulk(params) {
    return await this.elasticsearchService.bulk(params);
  }
  //统计数量
  async count(params) {
    return await this.elasticsearchService.count(params);
  }
}
