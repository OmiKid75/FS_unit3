import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlatformSelector from "../components/PlatformSelector";
import CharacterCounter from "../components/CharacterCounter";
import ValidationAlert from "../components/ValidationAlert";
import MediaUploader from "../components/MediaUploader";
import { addPost, updatePost, uploadPostMedia, fetchPosts } from "../redux/postsSlice";
import { saveDraft, updateDraft, fetchDrafts } from "../redux/draftsSlice";
import { setPlatforms, clearPlatforms } from "../redux/platformsSlice";
import { selectAllPosts, selectSelectedPlatforms } from "../redux/selectors";
import { HASHTAG_SUGGESTIONS } from "../utils/platformRules";
import { validatePlatformsClient } from "../utils/validateClient";

const CreatePost = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allPosts = useSelector(selectAllPosts);
  const platforms = useSelector(selectSelectedPlatforms);
  const { error } = useSelector((state) => state.posts);
  const existingPost = editId ? allPosts.find((p) => p._id === editId) : null;

  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!allPosts.length) {
      dispatch(fetchPosts());
      dispatch(fetchDrafts());
    }
  }, [dispatch, allPosts.length]);

  useEffect(() => {
    if (existingPost) {
      setContent(existingPost.content);
      dispatch(setPlatforms(existingPost.platforms));
      setHashtags(existingPost.hashtags || []);
      if (existingPost.scheduledDate) {
        const d = new Date(existingPost.scheduledDate);
        setScheduledDate(d.toISOString().slice(0, 10));
        setScheduledTime(d.toTimeString().slice(0, 5));
      }
    } else {
      dispatch(clearPlatforms());
    }
  }, [existingPost, dispatch]);

  const validation = useMemo(
    () => validatePlatformsClient(content, platforms),
    [content, platforms]
  );

  const buildScheduledISO = useCallback(() => {
    if (!scheduledDate || !scheduledTime) return null;
    return new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
  }, [scheduledDate, scheduledTime]);

  const handleSave = useCallback(
    async (status) => {
      setSaving(true);
      const payload = {
        content,
        platforms,
        hashtags,
        status,
        scheduledDate: status === "scheduled" ? buildScheduledISO() : null,
      };

      let result;
      if (status === "draft") {
        result = editId
          ? await dispatch(updateDraft({ id: editId, ...payload }))
          : await dispatch(saveDraft(payload));
      } else {
        result = editId
          ? await dispatch(updatePost({ id: editId, ...payload }))
          : await dispatch(addPost(payload));
      }

      if (result.type.endsWith("/fulfilled")) {
        const postId = result.payload._id;
        if (files.length) await dispatch(uploadPostMedia({ id: postId, files }));
        dispatch(clearPlatforms());
        navigate(status === "draft" ? "/drafts" : status === "scheduled" ? "/scheduled" : "/");
      }
      setSaving(false);
    },
    [content, platforms, hashtags, buildScheduledISO, editId, files, dispatch, navigate]
  );

  const toggleHashtag = useCallback((tag) => {
    setHashtags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }, []);

  return (
    <>
      <Navbar title={editId ? "Edit Post" : "Create Post"} />
      <main className="flex-1 px-6 py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="card p-5">
              <label className="text-sm font-medium block mb-2">Content</label>
              <textarea
                rows={8}
                className="input-field w-full px-3 py-3 text-sm resize-none"
                placeholder="What do you want to share?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="mt-3">
                <CharacterCounter content={content} />
              </div>
            </div>

            <div className="card p-5">
              <label className="text-sm font-medium block mb-3">Platforms</label>
              <PlatformSelector />
            </div>

            {platforms.includes("instagram") && (
              <div className="card p-5">
                <label className="text-sm font-medium block mb-3">Suggested Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {HASHTAG_SUGGESTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleHashtag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        hashtags.includes(tag) ? "bg-accent/20 border-accent/50 text-accent-soft" : "border-line text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-5">
              <label className="text-sm font-medium block mb-3">Media</label>
              <MediaUploader onFilesSelected={setFiles} existingMedia={existingPost?.media || []} />
            </div>

            <ValidationAlert errors={error ? [error] : []} warnings={validation.warnings} />
          </div>

          <div className="flex flex-col gap-5">
            <div className="card p-5">
              <label className="text-sm font-medium block mb-3">Live Preview</label>
              <div className="rounded-lg border border-line p-4 bg-panel/40 min-h-[120px]">
                <p className="text-sm text-slate-200 whitespace-pre-wrap">{content || "Your post preview will appear here…"}</p>
                {hashtags.length > 0 && <p className="text-xs text-accent-soft mt-2">{hashtags.join(" ")}</p>}
              </div>
            </div>

            <div className="card p-5">
              <label className="text-sm font-medium block mb-3">Schedule</label>
              <div className="flex flex-col gap-2">
                <input type="date" className="input-field w-full px-3 py-2 text-sm" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                <input type="time" className="input-field w-full px-3 py-2 text-sm" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => handleSave("draft")} disabled={saving || !content} className="btn-ghost rounded-lg py-2.5 text-sm">
                Save as Draft
              </button>
              <button onClick={() => handleSave("scheduled")} disabled={saving || !validation.valid || !scheduledDate || !scheduledTime} className="btn-ghost rounded-lg py-2.5 text-sm">
                Schedule Post
              </button>
              <button onClick={() => handleSave("published")} disabled={saving || !validation.valid} className="btn-primary rounded-lg py-2.5 text-sm">
                {saving ? "Saving…" : "Publish Now"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CreatePost;