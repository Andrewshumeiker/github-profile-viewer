import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { GithubUserResponseDto } from './dto/github-user-response.dto';
import { GithubApiUser } from './interfaces/github-api-user.interface';

const GITHUB_USERNAME_PATTERN =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async getUserByUsername(rawUsername: string): Promise<GithubUserResponseDto> {
    const username = rawUsername.trim();

    if (!GITHUB_USERNAME_PATTERN.test(username)) {
      throw new BadRequestException('A valid GitHub username is required.');
    }

    try {
      const token = process.env.GITHUB_TOKEN;
      const { data } = await firstValueFrom(
        this.httpService.get<GithubApiUser>(
          `https://api.github.com/users/${encodeURIComponent(username)}`,
          {
            headers: {
              Accept: 'application/vnd.github+json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        ),
      );

      return {
        username: data.login,
        name: data.name,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        location: data.location,
        company: data.company,
        blog: data.blog,
        profileUrl: data.html_url,
        publicRepos: data.public_repos,
        followers: data.followers,
        following: data.following,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundException('GitHub user not found.');
      }

      throw new BadGatewayException('Unable to retrieve the GitHub profile.');
    }
  }
}
