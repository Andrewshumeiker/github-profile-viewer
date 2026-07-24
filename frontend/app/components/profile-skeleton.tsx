import styles from "../page.module.css";

export function ProfileSkeleton() {
  return (
    <div className={styles.skeleton} aria-label="Cargando perfil">
      <div className={styles.skeletonTop}>
        <span className={styles.skeletonAvatar} />
        <div>
          <span className={styles.skeletonLineShort} />
          <span className={styles.skeletonLineTitle} />
          <span className={styles.skeletonLineText} />
        </div>
      </div>
      <div className={styles.skeletonStats}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
