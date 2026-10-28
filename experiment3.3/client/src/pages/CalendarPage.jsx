import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Calendar from "../components/Calendar";
import { fetchPosts } from "../redux/postsSlice";
import { fetchDrafts } from "../redux/draftsSlice";

const CalendarPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchDrafts());
  }, [dispatch]);

  return (
    <>
      <Navbar title="Calendar" />
      <main className="flex-1 px-6 py-6 max-w-3xl">
        <Calendar />
      </main>
    </>
  );
};

export default CalendarPage;
