import { Controller, Get, Request } from '@nestjs/common';
import { SearchService } from '../../../service/search/search.service';
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @Get()
  async index() {
    const result = await this.searchService.search({
      index: 'news',
      type: 'doc',
      body: {
        query: {
          match: {
            content: '小米',
          },
        },
      },
    });
    return result;
  }
  @Get('add')
  async add() {
    // let result = await this.searchService.bulk({
    //     body: [
    //         { index: { _index: 'news', _type: 'doc'} },
    //         { content: 'nestjs仿小米商城项目 有支付宝功能' }
    //     ]
    // })

    const result = await this.searchService.bulk({
      body: [
        { index: { _index: 'news', _type: 'doc', _id: '111111111' } },
        { content: 'nestjs仿小米商城项目 要完结了' },
      ],
    });
    return result;
  }
  @Get('edit')
  async edit() {
    const result = await this.searchService.bulk({
      body: [
        {
          update: { _index: 'news', _type: 'doc', _id: 'yG0MNHEBDCwmnk5cs-Zy' },
        },
        { doc: { content: 'nestjs仿小米商城项目 有微信支付的功能' } },
      ],
    });
    return result;
  }
  @Get('delete')
  async delete() {
    const result = await this.searchService.bulk({
      body: [{ delete: { _index: 'news', _type: 'doc', _id: '111111111' } }],
    });
    return result;
  }

  @Get('count')
  async count() {
    const result = await this.searchService.count({
      index: 'news',
      type: 'doc',
      body: {
        query: {
          match: {
            content: '公安',
          },
        },
      },
    });
    return result;
  }

  @Get('listpage')
  async listpage(@Request() req) {
    const page = req.query.page || 1;
    const pageSize = 2;
    const result = await this.searchService.search({
      index: 'news',
      type: 'doc',
      body: {
        from: (page - 1) * pageSize,
        size: pageSize,
        query: {
          match: {
            content: '公安',
          },
        },
      },
    });
    return result;
  }
}
