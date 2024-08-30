import {
  Controller,
  Get,
  Post,
  Query,
  ParseIntPipe,
  Body,
  ParseUUIDPipe,
  Put,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersListQuery } from '../domain/queries/list-users.query';
import { ListUsersDto } from '../domain/dtos/list-users.dto';
import { UsersByUuidQuery } from '../domain/queries/users-by-uuid.query';
import { ReadUsersDto } from '../domain/dtos/read-users.dto';
import { UpdateUsersDto } from '../domain/dtos/update-users.dto';
import { UpdateUsersCommand } from '../domain/commands/update-users.command';
import { DeleteUsersCommand } from '../domain/commands/delete-users.command';
import { RestoreUsersCommand } from '../domain/commands/restore-users.command ';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  
  @ApiBearerAuth()
  @Get('find-by-uuid')
  @ApiOperation({ summary: 'Get User By Uuid' })
  @ApiQuery({ name: 'uuid', type: String, required: true })
  async getUserByUuid(
    @Query('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<ReadUsersDto> {
    return await this.queryBus.execute<UsersByUuidQuery, ReadUsersDto>(
      new UsersByUuidQuery(uuid),
    );
  }

  
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'Get user list and search' })
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'itemsPerPage', type: Number, required: true, example: 20 })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: ListUsersDto,
  })
  async getUserList(
    @Query('page', ParseIntPipe) page: number,
    @Query('itemsPerPage', ParseIntPipe) itemsPerPage: number,
    @Query('search') search?: string,
  ): Promise<ListUsersDto> {
    return await this.queryBus.execute<UsersListQuery, ListUsersDto>(
      new UsersListQuery(page, itemsPerPage, search),
    );
  }

  
  @ApiBearerAuth()
  @Put('update')
  @ApiOperation({ summary: 'Update User' })
  @ApiBody({ type: UpdateUsersDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been sucessfully updated.',
    type: ReadUsersDto,
  })
  @ApiQuery({ name: 'uuid', type: String, required: true })
  async putUserByUuid(
    @Query('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUsersDto: UpdateUsersDto,
  ): Promise<ReadUsersDto> {
    return await this.commandBus.execute(
      new UpdateUsersCommand(uuid, updateUsersDto),
    );
  }

  
  @ApiBearerAuth()
  @Patch('restore')
  @ApiOperation({ summary: 'Restore a user' })
  @ApiQuery({ name: 'uuid', type: String, required: true })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully restored.',
    type: ReadUsersDto,
  })
  async restoreUser(
    @Query('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<ReadUsersDto> {
    return await this.commandBus.execute(new RestoreUsersCommand(uuid));
  }

  
  @ApiBearerAuth()
  @Delete('soft-delete')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiQuery({ name: 'uuid', type: String, required: true })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully soft deleted.',
    type: ReadUsersDto,
  })
  async softDeleteUser(
    @Query('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<ReadUsersDto> {
    return await this.commandBus.execute(new DeleteUsersCommand(uuid));
  }
}
