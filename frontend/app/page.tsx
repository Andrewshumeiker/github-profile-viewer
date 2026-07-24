"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ProfileCard } from "./components/profile-card";
import { ProfileSkeleton } from "./components/profile-skeleton";
import styles from "./page.module.css";
import { getGithubUser } from "./services/github-profile.service";
import { GithubUser } from "./types/github-user";

const DEFAULT_USERNAME =
  process.env.NEXT_PUBLIC_DEFAULT_USERNAME ?? "Andrewshumeiker";

export default function Home() {
  const [query, setQuery] = useState(DEFAULT_USERNAME);
  const [profile, setProfile] = useState<GithubUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);

    try {
      setProfile(await getGithubUser(username));
    } catch (requestError) {
      setProfile(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible cargar el perfil. Inténtalo nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    getGithubUser(DEFAULT_USERNAME)
      .then((user) => {
        if (isCurrent) {
          setProfile(user);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No fue posible cargar el perfil. Inténtalo nuevamente.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const username = query.trim();

    if (username) {
      void loadProfile(username);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell} aria-labelledby="page-title">
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.statusDot} />
            GitHub API · Live
          </div>
          <h1 id="page-title">Un perfil, sin ruido.</h1>
          <p>
            Consulta la información pública de cualquier cuenta de GitHub a
            través de nuestro backend en NestJS.
          </p>
        </header>

        <form className={styles.search} onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario de GitHub</label>
          <div className={styles.searchRow}>
            <span aria-hidden="true">@</span>
            <input
              id="username"
              name="username"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="octocat"
              autoComplete="off"
              spellCheck="false"
            />
            <button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? "Buscando…" : "Buscar"}
            </button>
          </div>
        </form>

        <div className={styles.result} aria-live="polite" aria-busy={isLoading}>
          {isLoading && <ProfileSkeleton />}

          {!isLoading && error && (
            <div className={styles.error} role="alert">
              <span aria-hidden="true">!</span>
              <div>
                <strong>No pudimos mostrar ese perfil</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!isLoading && profile && <ProfileCard user={profile} />}
        </div>

        <footer className={styles.footer}>
          <span>Next.js</span>
          <span aria-hidden="true">→</span>
          <span>NestJS</span>
          <span aria-hidden="true">→</span>
          <span>GitHub REST API</span>
        </footer>
      </section>
    </main>
  );
}
