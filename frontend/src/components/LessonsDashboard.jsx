import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

const LessonsDashboard = () => {
  const { classId, subject, chapter } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userClass, setUserClass] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const numericClassId = classId ? parseInt(classId, 10) : null;

  const getCurrentView = () => {
    if (chapter) return "chapter";
    if (subject) return "subject";
    if (numericClassId) return "class";
    return "main";
  };
  const currentView = getCurrentView();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericClassId, subject, chapter]);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    let url =
      "http://127.0.0.1:5008/eduverse-c818a/us-central1/vlab/lessons";
    if (chapter) {
      url += `/${numericClassId}/${subject}/chapter/${chapter}`;
    } else if (subject) {
      url += `/${numericClassId}/${subject}`;
    } else if (numericClassId) {
      url += `/${numericClassId}`;
    }

    const headers = {};
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();

    // ✅ Force only the user’s class to show
    if (
      currentView === "main" &&
      Array.isArray(result.classes) &&
      result.classes.length > 0
    ) {
      const userOnlyClass = result.classes[0]; // first class returned is user's class
      setUserClass(userOnlyClass);
      setData({ ...result, classes: [userOnlyClass] }); // overwrite classes with only the user class
    } else {
      setUserClass(null);
      setData(result || {});
    }

    setLoading(false);
  } catch (err) {
    console.error("Fetch error:", err);
    setError(err.message || "Something went wrong");
    setLoading(false);
  }
};


  const openFile = (filename, type = "notes") => {
    let url;
    if (type === "textbook") {
      url = `http://127.0.0.1:5008/eduverse-c818a/us-central1/vlab/lessons/${numericClassId}/${subject}/textbook/${filename}`;
    } else {
      url = `http://127.0.0.1:5008/eduverse-c818a/us-central1/vlab/lessons/${numericClassId}/${subject}/notes/${chapter}/${filename}`;
    }
    window.open(url, "_blank");
  };

  const getSubjectIcon = (subjectName) => {
    switch (subjectName) {
      case "Science":
        return "🔬";
      case "SocialScience":
        return "🌍";
      default:
        return "📖";
    }
  };

  const Breadcrumb = () => {
    const items = [{ label: "📚 Lessons", path: "/dashboard/lessons" }];
    if (numericClassId)
      items.push({
        label: `Class ${numericClassId}`,
        path: `/dashboard/lessons/${numericClassId}`,
      });
    if (subject)
      items.push({
        label: subject === "SocialScience" ? "Social Science" : subject,
        path: `/dashboard/lessons/${numericClassId}/${subject}`,
      });
    if (chapter) items.push({ label: chapter, path: location.pathname });

    return (
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          {items.map((item, index) => (
            <React.Fragment key={item.path}>
              {index < items.length - 1 ? (
                <li>
                  <button
                    onClick={() => navigate(item.path)}
                    className="hover:text-purple-600 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ) : (
                <li className="text-gray-800 font-medium">{item.label}</li>
              )}
              {index < items.length - 1 && <li>/</li>}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  };

  if (loading)
    return (
      <div className="text-center p-10 text-gray-700 font-semibold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center p-10">
        <div className="mb-4">Error: {error}</div>
      </div>
    );

  // MAIN VIEW
  if (currentView === "main") {
    return (
      <div className="min-h-screen bg-purple-100 py-10">
        <div className="bg-white p-8 shadow-lg text-center mb-8 w-full rounded-none relative">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">📚 Lessons</h1>
          <p className="text-gray-600">
            {userClass
              ? `Your class: ${userClass}`
              : "Select your class to access study materials"}
          </p>
        </div>

        <div className="bg-white p-8 shadow-lg w-full rounded-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.classes?.map((classNumber) => (
              <div
                key={classNumber}
                onClick={() => navigate(`/dashboard/lessons/${classNumber}`)}
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-2">🎓</div>
                <p className="font-bold text-purple-700 text-lg mb-2">
                  Class {classNumber}
                </p>
                <p className="text-gray-500 text-sm text-center">
                  Study materials & notes
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CLASS VIEW
  if (currentView === "class") {
    return (
      <div className="min-h-screen bg-purple-100 py-10">
        <Breadcrumb />
        <div className="bg-white p-8 shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-purple-700 mb-6">
            Class {numericClassId} Subjects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.subjects?.map((subjectName) => (
              <div
                key={subjectName}
                onClick={() =>
                  navigate(`/dashboard/lessons/${numericClassId}/${subjectName}`)
                }
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-2">
                  {getSubjectIcon(subjectName)}
                </div>
                <p className="font-bold text-purple-700 text-lg mb-2">
                  {subjectName === "SocialScience"
                    ? "Social Science"
                    : subjectName}
                </p>
                <p className="text-gray-500 text-sm text-center">
                  Study materials available
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
// SUBJECT VIEW
if (currentView === "subject") {
  return (
    <div className="min-h-screen bg-purple-100 py-10">
      <Breadcrumb />
      <div className="bg-white p-8 shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          {subject === "SocialScience" ? "Social Science" : subject} - Class{" "}
          {numericClassId}
        </h1>

        <h2 className="text-xl font-semibold mb-4">📘 Textbooks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.textbooks?.length ? (
            data.textbooks.map((book) => (
              <div
                key={book}
                onClick={() => openFile(book, "textbook")}
                className="bg-white border rounded-lg shadow hover:shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105"
              >
                <div className="text-3xl mb-2">📖</div>
                <p className="font-semibold text-gray-700 truncate">{book}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No textbooks available</p>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">📂 Chapters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.chapters?.length ? (
            data.chapters.map((ch) => (
              <div
                key={ch}
                onClick={() =>
                  navigate(`/dashboard/lessons/${numericClassId}/${subject}/${ch}`)
                }
                className="bg-purple-50 border border-purple-200 rounded-lg shadow hover:shadow-md p-4 cursor-pointer transition-transform transform hover:scale-105"
              >
                <div className="text-2xl mb-2">📄</div>
                <p className="font-semibold text-purple-700">{ch}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No chapters available</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Optional: return null or other view if currentView !== "subject"



  // CHAPTER VIEW
  if (currentView === "chapter") {
    return (
      <div className="min-h-screen bg-purple-100 py-10">
        <Breadcrumb />
        <div className="bg-white p-8 shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-purple-700 mb-6">
            {chapter} - {subject} (Class {numericClassId})
          </h1>
          {data.files?.length ? (
            <ul className="space-y-2">
              {data.files.map((file) => (
                <li key={file}>
                  <button
                    onClick={() => openFile(file, "notes")}
                    className="text-green-600 underline"
                  >
                    {file}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No files available for this chapter</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default LessonsDashboard;
