interface VideoPlayerProps {
  videoUrl?: string | null;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  if (videoUrl) {
    return (
      <div className="video-wrapper">
        <video src={videoUrl} controls title={title} />
      </div>
    );
  }
  return (
    <div className="video-placeholder">
      <p style={{ fontSize: '18px', fontWeight: 600 }}>{title}</p>
      <p style={{ fontSize: '14px', opacity: 0.7 }}>Vídeo próximamente disponible</p>
    </div>
  );
}
