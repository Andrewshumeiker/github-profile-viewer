import { Controller, Get, Param } from '@nestjs/common';
import { GithubUserResponseDto } from './dto/github-user-response.dto';
import { GithubService } from './github.service';

@Controller()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('user/:username')
  getUser(@Param('username') username: string): Promise<GithubUserResponseDto> {
    return this.githubService.getUserByUsername(username);
  }
}
