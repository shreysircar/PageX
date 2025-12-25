import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

export const processVideo = async (file) => {
  const thumbnailPath = file.path.replace(
    path.extname(file.path),
    "-thumb.png"
  );

  return new Promise((resolve, reject) => {
    ffmpeg(file.path)
      .screenshots({
        timestamps: ["1"],
        filename: path.basename(thumbnailPath),
        folder: path.dirname(thumbnailPath),
        size: "300x?",
      })
      .on("end", () => {
        ffmpeg.ffprobe(file.path, (err, metadata) => {
          if (err) return reject(err);

          resolve({
            thumbnailPath,
            duration: Math.floor(metadata.format.duration),
          });
        });
      })
      .on("error", reject);
  });
};
