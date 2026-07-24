export class GithubUserResponseDto {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
}
