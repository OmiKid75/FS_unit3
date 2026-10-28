import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { fetchPublishedFeed } from "../redux/postsSlice";

const BrowsePosts = () => {
  const dispatch = useDispatch();
  const { publicItems, status } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPublishedFeed());
  }, [dispatch]);

  return (
    <>
      <Navbar title="Browse Posts" />
      <main className="flex-1 px-6 py-6">
        <p className="text-sm text-slate-400 mb-5">Published posts from every creator, most recent first.</p>

        {status === "loading" && <p className="text-sm text-slate-500">Loading…</p>}
        {status === "succeeded" && publicItems.length === 0 && (
          <div className="card p-8 text-center text-sm text-slate-500">No published posts yet.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicItems.map((post) => (
            <PostCard key={post._id} post={post} readOnly />
          ))}
        </div>
      </main>
    </>
  );
};

export default BrowsePosts;