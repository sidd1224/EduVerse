// seed.js

const admin = require("firebase-admin");

// Initialize the Admin SDK
admin.initializeApp({
  // We don't need credentials for the local emulator
  projectId: "eduverse-c818a", // Use a dummy project ID
});

// Get a reference to the Firestore database
const db = admin.firestore();
// Point the SDK to your local emulator
db.settings({
  host: "127.0.0.1:8070", // This is the default Firestore emulator port
  ssl: false,
});

// --- YOUR SAMPLE DATA GOES HERE ---
const sampleData = {
  courses: [
    {
      id: "physics_10", // We'll use custom IDs for easier linking
      title: "Class 10 Physics",
      description: "An introduction to the fundamental principles of physics.",
      subject: "Physics",
    },
    {
      id: "chemistry_10",
      title: "Class 10 Chemistry",
      description: "Exploring the world of atoms, molecules, and reactions.",
      subject: "Chemistry",
    },
  ],
  lessons: [
    {
      courseId: "physics_10", // Link to the Physics course
      title: "Chapter 1: Electricity",
      content: "This chapter covers circuits, voltage, and current...",
      order: 1,
    },
    {
      courseId: "physics_10",
      title: "Chapter 2: Magnetism",
      content: "Learn about magnetic fields and electromagnets.",
      order: 2,
    },
  ],
  quizzes: [
    {
      // We will link this quiz to the 'Electricity' lesson after it's created
      title: "Electricity Basics Quiz",
      questions: [
        {
          questionText: "What is the unit of electric current?",
          options: ["Volt", "Watt", "Ampere"],
          correctOptionIndex: 2,
        },
        {
          questionText: "Which device measures voltage?",
          options: ["Ammeter", "Voltmeter", "Thermometer"],
          correctOptionIndex: 1,
        },
      ],
    },
  ],
};

// --- THE SEEDING LOGIC ---
async function seedDatabase() {
  console.log("Starting to seed the database...");

  // Seed Courses
  for (const course of sampleData.courses) {
    await db.collection("courses").doc(course.id).set(course);
    console.log(`- Created course: ${course.title}`);
  }

  // Seed Lessons
  let electricityLessonId;
  for (const lesson of sampleData.lessons) {
    const newLessonRef = await db.collection("lessons").add(lesson);
    console.log(`- Created lesson: ${lesson.title}`);
    // Save the ID of the electricity lesson so we can link the quiz to it
    if (lesson.title.includes("Electricity")) {
      electricityLessonId = newLessonRef.id;
    }
  }

  // Seed Quizzes and link to the lesson
  for (const quiz of sampleData.quizzes) {
    quiz.lessonId = electricityLessonId; // Add the reference
    await db.collection("quizzes").add(quiz);
    console.log(`- Created quiz: ${quiz.title}`);
  }

  console.log("Database seeding completed successfully!");
}

// Run the seeding function
seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
});