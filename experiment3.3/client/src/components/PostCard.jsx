import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { statusColor, formatDateTime } from "../utils/platformRules";
import { publishPost } from "../redux/postsSlice";
import { useAuth } from "../hooks/useAuth";

const PLATFORM_COLOR = { facebook: "#5B8DEF", instagram: "#E1487C", whatsapp: "#3FC97F" };

// readOnly=true (used on the Viewer's Browse Posts feed) hides every action
// button — a concrete example of UI rendering differently based on role.
const PostCard = memo(function PostCard({ post, onDelete, readOnly = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();

  const isOwner = post.author === user?._id || post.author?._id === user?._id;
  const canManage = !readOnly && (isOwner || isAdmin);

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-1.5">
          {post.platforms.map((p) => (
            <span key={p} className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: PLATFORM_COLOR[p] }} />
          ))}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(post.status)}`}>
          {post.status}
        </span>
      </div>

      <p className="text-sm text-slate-200 line-clamp-3">{post.content}</p>

      {post.media?.length > 0 && (
        <div className="flex gap-1.5">
          {post.media.slice(0, 3).map((m) => (
            <div key={m._id} className="w-10 h-10 rounded overflow-hidden bg-panel border border-line">
              {m.fileType?.startsWith("video") ? (
                <video src={m.fileUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={m.fileUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-1 text-xs text-slate-500 font-mono">
        <span>{formatDateTime(post.scheduledDate || post.createdAt)}</span>
        {canManage && (
          <div className="flex gap-3">
            {post.status !== "published" && (
              <button onClick={() => dispatch(publishPost(post._id))} className="text-wa hover:underline">
                Publish
              </button>
            )}
            <button onClick={() => navigate(`/create?edit=${post._id}`)} className="text-accent-soft hover:underline">
              Edit
            </button>
            <button onClick={() => onDelete(post)} className="text-danger hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default PostCard;