import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrayApiService } from './oray-api/oray-api.service';
import { mergeMap } from 'rxjs';
import { Request } from 'express';
import { RemoveMemberRequest } from './oray-api/interfaces/remove-member.request';
import { AddMemberRequest } from './oray-api/interfaces/add-member.request';
import { AuthGuard } from '../guards/auth/auth.guard';

@Controller('api/v2')
@UseGuards(AuthGuard)
export class ApiController {
  constructor(private oray: OrayApiService) {}

  @Get('service')
  public getServiceInfo(@Req() request: Request) {
    const { username, md5Password } = request['user'];

    return this.oray
      .getToken(username, md5Password)
      .pipe(mergeMap((token) => this.oray.getAccountInfo(token)));
  }

  @Get('networks')
  public listNetworks(@Req() request: Request) {
    const { username, md5Password } = request['user'];

    return this.oray
      .getToken(username, md5Password)
      .pipe(mergeMap((token) => this.oray.listNetworks(token)));
  }

  @Get('network/:networkid/state')
  public getNetworkState(
    @Param('networkid') networkId: number,
    @Req() request: Request,
  ) {
    const { username, md5Password } = request['user'];

    return this.oray
      .getToken(username, md5Password)
      .pipe(mergeMap((token) => this.oray.getNetworkState(token, networkId)));
  }

  @Get('network/:networkid/members')
  public getNetworkMembers(
    @Param('networkid') networkId: number,
    @Req() request: Request,
  ) {
    const { username, md5Password } = request['user'];

    return this.oray
      .getToken(username, md5Password)
      .pipe(mergeMap((token) => this.oray.getNetworkMembers(token, networkId)));
  }

  @Get('members')
  public getAllMembers(@Req() request: Request) {
    const { username, md5Password } = request['user'];
    const { notInNetwork } = request.query;

    return this.oray
      .getToken(username, md5Password)
      .pipe(
        mergeMap((token) => this.oray.getAllMembers(token, !!notInNetwork)),
      );
  }

  @Get('member/:memberid/devices')
  public getMemberDevices(
    @Param('memberid') memberId: string,
    @Req() request: Request,
  ) {
    try {
      const { username, md5Password } = request['user'];

      return this.oray
        .getToken(username, md5Password)
        .pipe(mergeMap((token) => this.oray.getMemberDevices(token, memberId)));
    } catch (e) {
      throw new HttpException(
        {
          code: e.code,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('member/remove')
  public removeMemberFromNetwork(
    @Body() removeMemberRequest: RemoveMemberRequest,
    @Req() request: Request,
  ) {
    const { username, md5Password } = request['user'];

    return this.oray
      .getToken(username, md5Password)
      .pipe(
        mergeMap((token) =>
          this.oray.removeMemberFromNetwork(token, removeMemberRequest),
        ),
      );
  }

  @Post('member/add')
  public addMemberToNetwork(
    @Body() addMemberRequest: AddMemberRequest,
    @Req() request: Request,
  ) {
    const { username, md5Password } = request['user'];

    return this.oray
      .getToken(username, md5Password)
      .pipe(
        mergeMap((token) =>
          this.oray.addMemberFromNetwork(token, addMemberRequest),
        ),
      );
  }
}
