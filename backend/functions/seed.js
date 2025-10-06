// seed.js - Production-style Firestore seeder (no test users)
const admin = require("firebase-admin");
const dbData = require("./db.json"); // Import experiment data

// ✅ Configure Firestore emulator
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8065";

// Initialize Firebase Admin for emulator
admin.initializeApp({ projectId: "eduverse-c818a" });

const db = admin.firestore();

// ✅ Static base data
const sampleData = {
  courses: [
    {
      id: "physics_10",
      title: "Class 10 Physics",
      description: "An introduction to the fundamental principles of physics.",
      subject: "Physics",
      class: "10",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      id: "chemistry_10",
      title: "Class 10 Chemistry",
      description: "Exploring atoms, molecules, and reactions.",
      subject: "Chemistry",
      class: "10",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      id: "physics_9",
      title: "Class 9 Physics",
      description: "Foundation concepts of physics for Class 9 students.",
      subject: "Physics",
      class: "9",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      id: "chemistry_9",
      title: "Class 9 Chemistry",
      description: "Basic chemistry concepts and experiments.",
      subject: "Chemistry",
      class: "9",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
  ],
  lessons: [
    {
      courseId: "physics_10",
      title: "Chapter 1: Light - Reflection and Refraction",
      content: "How light behaves when it hits surfaces and passes through materials...",
      order: 1,
      class: "10",
      subject: "Physics",
    },
    {
      courseId: "physics_10",
      title: "Chapter 2: Electricity",
      content: "Learn about electric current, potential difference, and Ohm's law...",
      order: 2,
      class: "10",
      subject: "Physics",
    },
    {
      courseId: "chemistry_10",
      title: "Chapter 1: Acids, Bases and Salts",
      content: "Understanding the properties and reactions of acids, bases, and salts...",
      order: 1,
      class: "10",
      subject: "Chemistry",
    },
    {
      courseId: "chemistry_10",
      title: "Chapter 2: Chemical Reactions and Equations",
      content: "Learn about chemical reactions and how to balance equations...",
      order: 2,
      class: "10",
      subject: "Chemistry",
    },
  ],
  quizzes: [
    {
      title: "Light and Optics Quiz",
      courseId: "physics_10",
      class: "10",
      subject: "Physics",
      questions: [
        {
          questionText: "What happens when light passes from air to glass?",
          options: ["It speeds up", "It slows down", "Speed remains same"],
          correctOptionIndex: 1,
        },
        {
          questionText: "Which mirror is used in car headlights?",
          options: ["Concave", "Convex", "Plane"],
          correctOptionIndex: 0,
        },
      ],
    },
    {
      title: "Electricity Basics Quiz",
      courseId: "physics_10",
      class: "10",
      subject: "Physics",
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

// ✅ Seeder function
async function seedDatabase() {
  console.log("🌱 Seeding Firestore emulator data...");
  console.log(`📍 Using emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`);

  let totalSeeded = 0;
  let totalSkipped = 0;

  try {
    // 🔹 Courses
    console.log("\n📚 Seeding Courses...");
    for (const course of sampleData.courses) {
      const ref = db.collection("courses").doc(course.id);
      const exists = await ref.get();
      if (!exists.exists) {
        await ref.set(course);
        console.log(`✅ ${course.title}`);
        totalSeeded++;
      } else {
        totalSkipped++;
      }
    }

    // 🔹 Lessons
    console.log("\n📖 Seeding Lessons...");
    for (const lesson of sampleData.lessons) {
      const id = `${lesson.courseId}_${lesson.title.replace(/\s+/g, "_").toLowerCase()}`;
      const ref = db.collection("lessons").doc(id);
      const exists = await ref.get();
      if (!exists.exists) {
        await ref.set({ ...lesson, created_at: admin.firestore.FieldValue.serverTimestamp() });
        console.log(`✅ ${lesson.title}`);
        totalSeeded++;
      } else totalSkipped++;
    }

    // 🔹 Quizzes
    console.log("\n❓ Seeding Quizzes...");
    for (const quiz of sampleData.quizzes) {
      const id = quiz.title.replace(/\s+/g, "_").toLowerCase();
      const ref = db.collection("quizzes").doc(id);
      const exists = await ref.get();
      if (!exists.exists) {
        await ref.set({ ...quiz, created_at: admin.firestore.FieldValue.serverTimestamp() });
        console.log(`✅ ${quiz.title}`);
        totalSeeded++;
      } else totalSkipped++;
    }

    // 🔹 Experiments
    console.log("\n🧪 Seeding Experiments...");
    if (Array.isArray(dbData) && dbData.length > 0) {
      for (const experiment of dbData) {
        const id = String(experiment.id);
        const ref = db.collection("experiments").doc(id);
        const exists = await ref.get();
        if (!exists.exists) {
          await ref.set({
            ...experiment,
            class: experiment.experiment_class || experiment.class,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`✅ ${experiment.title || `Experiment ${id}`}`);
          totalSeeded++;
        } else totalSkipped++;
      }
    }

    // 🔹 Empty student and progress collections
    console.log("\n👥 Creating empty collections: students, progress...");
    await db.collection("students").doc("_template_").set({ placeholder: true });
    await db.collection("progress").doc("_template_").set({ placeholder: true });

    console.log("✅ Placeholder docs added (safe to delete in production).");

    // ✅ Summary
    console.log("\n📊 DATABASE SUMMARY");
    console.log("================================");
    console.log(`📚 Courses:     ${(await db.collection("courses").get()).size}`);
    console.log(`📖 Lessons:     ${(await db.collection("lessons").get()).size}`);
    console.log(`❓ Quizzes:     ${(await db.collection("quizzes").get()).size}`);
    console.log(`🧪 Experiments: ${(await db.collection("experiments").get()).size}`);
    console.log("================================");
    console.log(`✅ Total seeded: ${totalSeeded}`);
    console.log(`⏭️  Total skipped: ${totalSkipped}`);
    console.log("🎉 Done! Static data seeded, no test users created.");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
  }
}

seedDatabase()
  .then(() => {
    console.log("✨ Database seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("💥 Fatal error:", err);
    process.exit(1);
  });
