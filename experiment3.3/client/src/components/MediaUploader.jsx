import { useRef, useState } from "react";

const MediaUploader = ({ onFilesSelected, existingMedia = [] }) => {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    setPreviews(
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
      }))
    );
    onFilesSelected(files);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-line rounded-xl p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
      >
        <p className="text-sm text-slate-400">
          Drop images or videos here, or <span className="text-accent-soft">click to browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
      </div>

      {(previews.length > 0 || existingMedia.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {existingMedia.map((m) => (
            <div key={m._id} className="aspect-square rounded-lg overflow-hidden bg-panel border border-line">
              {m.fileType.startsWith("video") ? (
                <video src={m.fileUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={m.fileUrl} alt={m.fileName} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
          {previews.map((p, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-panel border border-line">
              {p.type === "video" ? (
                <video src={p.url} className="w-full h-full object-cover" />
              ) : (
                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
