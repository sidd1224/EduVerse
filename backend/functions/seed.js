// seed.js

const admin = require("firebase-admin");
const dbData = require("./db.json"); // Import db.json data

// Initialize the Admin SDK
admin.initializeApp({
  projectId: "eduverse-c818a", // Use your Firebase project ID
});

const db = admin.firestore();

const sampleData = {
  courses: [
    {
      id: "physics_10",
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
      courseId: "physics_10",
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
    const docRef = db.collection("courses").doc(course.id);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      await docRef.set(course);
      console.log(`- Created course: ${course.title}`);
    } else {
      console.log(`- Course already exists: ${course.title}`);
    }
  }

  // Seed Lessons
  for (const lesson of sampleData.lessons) {
    const lessonId = lesson.title.replace(/\s+/g, "_").toLowerCase();
    const docRef = db.collection("lessons").doc(lessonId);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      await docRef.set(lesson);
      console.log(`- Created lesson: ${lesson.title}`);
    } else {
      console.log(`- Lesson already exists: ${lesson.title}`);
    }
  }

  // Seed Quizzes
  for (const quiz of sampleData.quizzes) {
    const quizId = quiz.title.replace(/\s+/g, "_").toLowerCase();
    const docRef = db.collection("quizzes").doc(quizId);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      await docRef.set(quiz);
      console.log(`- Created quiz: ${quiz.title}`);
    } else {
      console.log(`- Quiz already exists: ${quiz.title}`);
    }
  }

  // Seed Experiments
  for (const experiment of dbData) {
    const docRef = db.collection("experiments").doc(String(experiment.id));
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      await docRef.set(experiment);
      console.log(`- Created experiment: ${experiment.title || experiment.id}`);
    } else {
      console.log(`- Experiment already exists: ${experiment.title || experiment.id}`);
    }
  }

  console.log("Database seeding completed successfully!");
}

// Run the seeding function
seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
});