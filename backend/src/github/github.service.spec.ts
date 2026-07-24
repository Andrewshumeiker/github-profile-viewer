import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { GithubApiUser } from './interfaces/github-api-user.interface';
import { GithubService } from './github.service';

describe('GithubService', () => {
  const httpService = {
    get: jest.fn(),
  } as unknown as HttpService;

  const service = new GithubService(httpService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('transforms the GitHub response into the public contract', async () => {
    const githubUser: GithubApiUser = {
      login: 'octocat',
      name: 'The Octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231',
      bio: null,
      location: 'San Francisco',
      company: '@github',
      blog: 'https://github.blog',
      html_url: 'https://github.com/octocat',
      public_repos: 8,
      followers: 100,
      following: 4,
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(
        of({ data: githubUser } as AxiosResponse<GithubApiUser>),
      );

    await expect(service.getUserByUsername('octocat')).resolves.toEqual({
      username: 'octocat',
      name: 'The Octocat',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231',
      bio: null,
      location: 'San Francisco',
      company: '@github',
      blog: 'https://github.blog',
      profileUrl: 'https://github.com/octocat',
      publicRepos: 8,
      followers: 100,
      following: 4,
    });
  });

  it('maps a GitHub 404 to NotFoundException', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(
      throwError(() => ({
        isAxiosError: true,
        response: { status: 404 },
      })),
    );

    await expect(service.getUserByUsername('missing-user')).rejects.toThrow(
      NotFoundException,
    );
  });
});
