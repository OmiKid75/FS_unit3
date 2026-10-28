import { deletePost } from "../redux/postsSlice";
import { deleteDraft } from "../redux/draftsSlice";

// A post lives in draftsSlice while status === "draft", and in postsSlice
// once it's scheduled or published. This picks the correct thunk so pages
// don't need to duplicate that branching logic themselves.
export const dispatchDeleteForPost = (dispatch, post) => {
  if (post.status === "draft") return dispatch(deleteDraft(post._id));
  return dispatch(deletePost(post._id));
};
