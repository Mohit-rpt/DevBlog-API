import MainLayout from "../layouts/MainLayout.jsx";
import api from "../services/api.js";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const latestPostsRef = useRef(null);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [hasMore, setHasMore] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const suggestionDebounceRef = useRef(null);

  const scrollToLatestPosts = () => {
    latestPostsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const fetchPosts = async (opts = {}) => {
      const {
        page = 1,
        append = false,
        searchTerm = "",
        category = "",
        tag = "",
      } = opts;

      if (page === 1) setLoading(true);

      try {
        const resp = await api.get("/posts/all", {
          params: {
            page,
            limit,
            search: searchTerm || "",
            category: category || "",
            tag: tag || "",
          },
        });

        const newPosts = resp.data.data.posts || [];

        if (append) {
          setPosts((p) => [...p, ...newPosts]);
        } else {
          setPosts(newPosts);
        }

        const pagination = resp.data.data.pagination || {};
        setHasMore(!!pagination.hasNextPage || newPosts.length === limit);

        if (page === 1) {
          const cats = Array.from(
            new Set(newPosts.map((p) => p.category).filter(Boolean)),
          );
          setCategories(cats);

          const allTags = Array.from(
            new Set(
              newPosts.flatMap((p) => (Array.isArray(p.tags) ? p.tags : [])),
            ),
          );
          setTags(allTags);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (page === 1) setLoading(false);
      }
    };

    // initial load
    fetchPosts({ page: 1, append: false });
  }, []);

  // Debounced search effect (search + filters)
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        setPage(1);
        const resp = await api.get("/posts/all", {
          params: {
            search: search || "",
            category: selectedCategory || "",
            tag: tagFilter || "",
            page: 1,
            limit,
          },
        });

        setPosts(resp.data.data.posts || []);
        const pagination = resp.data.data.pagination || {};
        setHasMore(
          !!pagination.hasNextPage || resp.data.data.posts?.length === limit,
        );
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [search, selectedCategory, tagFilter]);

  // Suggestions for home search (debounced)
  useEffect(() => {
    if (suggestionDebounceRef.current)
      clearTimeout(suggestionDebounceRef.current);

    if (!search || search.trim() === "") {
      setSuggestions([]);
      return;
    }

    suggestionDebounceRef.current = setTimeout(async () => {
      try {
        setSuggestionLoading(true);
        const resp = await api.get("/posts/all", {
          params: { search: search.trim(), limit: 5 },
        });
        setSuggestions(resp.data.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setSuggestionLoading(false);
      }
    }, 300);

    return () => clearTimeout(suggestionDebounceRef.current);
  }, [search]);

  // Sync search term from URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";

    // Only update if different to avoid unnecessary re-renders
    if (q !== search) {
      setSearch(q);
    }
  }, [location.search]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl px-10 py-8 mb-10 shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left */}
            <div className="flex items-center gap-6 flex-1">
              <div className="flex-1">
                <p className="text-3xl font-semibold">Hi,</p>

                <h1 className="text-5xl font-extrabold text-blue-600 uppercase">
                  {user?.username}
                </h1>

                <p className="text-gray-600 mt-3 max-w-lg">
                  Welcome back to{" "}
                  <span className="font-semibold text-blue-600">DevBlog</span>.
                  Share your ideas, read inspiring blogs and connect with fellow
                  developers.
                </p>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => navigate("/create-post")}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
                  >
                    ✍️ Create Post
                  </button>

                  <button
                    onClick={scrollToLatestPosts}
                    className="border-2 border-blue-600 text-blue-600 px-5 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition"
                  >
                    📚 Explore Posts
                  </button>
                </div>

                {/* Search bar */}
                <div className="mt-4 w-full max-w-md">
                  <label className="sr-only" htmlFor="search">
                    Search posts
                  </label>
                  <div className="relative">
                    <input
                      id="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-full border border-gray-200 px-4 py-3 pr-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Search posts, content or tags..."
                      aria-label="Search posts"
                    />

                    {/* suggestions dropdown */}
                    {suggestions.length > 0 && (
                      <ul className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden z-50">
                        {suggestions.map((s) => (
                          <li
                            key={s._id}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                            onClick={() => {
                              setSearch(s.title);
                              setSuggestions([]);
                            }}
                          >
                            {s.title}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-1">
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="text-sm text-gray-500 px-3 py-1 rounded-full hover:bg-gray-100"
                          aria-label="Clear search"
                        >
                          Clear
                        </button>
                      )}

                      <button
                        onClick={() => {
                          // immediate search trigger
                          if (searchTimeoutRef.current)
                            clearTimeout(searchTimeoutRef.current);
                          setSearch((s) => s);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full ml-2 hover:bg-blue-700 transition"
                      >
                        {searching ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </div>

                  {/* Tags (kept inside hero) */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {tags.slice(0, 8).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTagFilter(t === tagFilter ? "" : t)}
                        className={`px-3 py-1 rounded-full text-sm ${t === tagFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="hidden lg:flex">
              <div className="w-36 h-36 rounded-full bg-blue-100 flex items-center justify-center shadow-xl">
                <span className="text-6xl animate-bounce">🚀</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category pills row (responsive) */}
        <div className="mt-6">
          <div className="flex gap-3 overflow-x-auto py-2">
            <button
              onClick={() => {
                setSelectedCategory("");
                setSearch("");
              }}
              className={`px-4 py-2 rounded-full text-sm ${selectedCategory === "" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              All Categories
            </button>

            {categories.map((c) => (
              <button
                key={c}
                onClick={() =>
                  setSelectedCategory(c === selectedCategory ? "" : c)
                }
                className={`px-4 py-2 rounded-full text-sm ${c === selectedCategory ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md px-8 py-5">
            <p className="text-gray-500 text-sm">Total Posts</p>

            <h2 className="text-3xl font-bold">{posts.length}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md px-8 py-5">
            <p className="text-gray-500 text-sm">Status</p>

            <h2 className="text-3xl font-bold text-blue-600">Active</h2>
          </div>
        </div>

        {/* Latest Posts */}
        <div
          ref={latestPostsRef}
          className="flex justify-between items-center mb-8 scroll-mt-28"
        >
          <div>
            <h2 className="text-4xl font-bold">Latest Posts</h2>

            <p className="text-gray-500 mt-2">
              Discover the most recent blogs from our community.
            </p>
          </div>

          <button
            onClick={scrollToLatestPosts}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg transition"
          >
            View All Posts →
          </button>
        </div>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold">No Results</h2>

            <p className="text-gray-500 mt-3">
              Try a different search or clear filters.
            </p>

            <div className="mt-4">
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                  setTagFilter("");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={async () => {
                    const next = page + 1;
                    setPage(next);
                    try {
                      const resp = await api.get("/posts/all", {
                        params: {
                          page: next,
                          limit,
                          search: search || "",
                          category: selectedCategory || "",
                          tag: tagFilter || "",
                        },
                      });

                      setPosts((p) => [...p, ...(resp.data.data.posts || [])]);
                      const pagination = resp.data.data.pagination || {};
                      setHasMore(
                        !!pagination.hasNextPage ||
                          resp.data.data.posts?.length === limit,
                      );
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};
export default Home;
