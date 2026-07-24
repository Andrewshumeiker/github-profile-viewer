import { GithubUser } from "../types/github-user";

interface ApiError {
  message?: string | string[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getGithubUser(username: string): Promise<GithubUser> {
  const response = await fetch(
    `${API_URL}/user/${encodeURIComponent(username.trim())}`,
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as ApiError;
    const backendMessage = Array.isArray(error.message)
      ? error.message[0]
      : error.message;

    if (response.status === 404) {
      throw new Error("No encontramos un usuario de GitHub con ese nombre.");
    }

    throw new Error(
      backendMessage ?? "No fue posible cargar el perfil. Inténtalo nuevamente.",
    );
  }

  return (await response.json()) as GithubUser;
}
