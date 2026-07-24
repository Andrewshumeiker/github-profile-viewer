import Image from "next/image";
import styles from "../page.module.css";
import { GithubUser } from "../types/github-user";

interface ProfileCardProps {
  user: GithubUser;
}

function normalizeUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const details = [
    user.location && { label: "Ubicación", value: user.location },
    user.company && { label: "Empresa", value: user.company },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <Image
          className={styles.avatar}
          src={user.avatarUrl}
          alt={`Avatar de ${user.name ?? user.username}`}
          width={112}
          height={112}
          priority
        />

        <div className={styles.identity}>
          <p className={styles.username}>@{user.username}</p>
          <h2>{user.name ?? user.username}</h2>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
        </div>

        <a
          className={styles.profileLink}
          href={user.profileUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          Ver en GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>

      {(details.length > 0 || user.blog) && (
        <dl className={styles.details}>
          {details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}

          {user.blog && (
            <div>
              <dt>Sitio web</dt>
              <dd>
                <a
                  href={normalizeUrl(user.blog)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {user.blog}
                </a>
              </dd>
            </div>
          )}
        </dl>
      )}

      <dl className={styles.stats}>
        <div>
          <dt>Repositorios</dt>
          <dd>{user.publicRepos.toLocaleString("es-CO")}</dd>
        </div>
        <div>
          <dt>Seguidores</dt>
          <dd>{user.followers.toLocaleString("es-CO")}</dd>
        </div>
        <div>
          <dt>Siguiendo</dt>
          <dd>{user.following.toLocaleString("es-CO")}</dd>
        </div>
      </dl>
    </article>
  );
}
