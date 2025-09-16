// seed.js - Updated for Firestore Emulator with Persistent Data
const admin = require("firebase-admin");
const dbData = require("./db.json"); // Import db.json data

// ✅ Configure for Firestore Emulator
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8065";

// Initialize the Admin SDK for emulator
admin.initializeApp({
  projectId: "eduverse-c818a", // Your Firebase project ID
});

const db = admin.firestore();

// ✅ Enhanced sample data with better structure
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
      description: "Exploring the world of atoms, molecules, and reactions.",
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
      content: "This chapter covers how light behaves when it hits surfaces and passes through different materials...",
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
      content: "Learn about different types of chemical reactions and how to balance equations...",
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
    {
      title: "Acids and Bases Quiz",
      courseId: "chemistry_10",
      class: "10", 
      subject: "Chemistry",
      questions: [
        {
          questionText: "What color does red litmus turn in a base?",
          options: ["Red", "Blue", "Green"],
          correctOptionIndex: 1,
        },
        {
          questionText: "What is the pH of pure water?",
          options: ["6", "7", "8"],
          correctOptionIndex: 1,
        },
      ],
    },
  ],
};

// ✅ Enhanced seeding with better error handling and logging
async function seedDatabase() {
  console.log("🌱 Starting to seed the Firestore emulator database...");
  console.log(`📍 Using emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`);
  
  let totalSeeded = 0;
  let totalSkipped = 0;

  try {
    // ✅ Seed Courses
    console.log("\n📚 Seeding Courses...");
    for (const course of sampleData.courses) {
      const docRef = db.collection("courses").doc(course.id);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) {
        await docRef.set(course);
        console.log(`   ✅ Created course: ${course.title}`);
        totalSeeded++;
      } else {
        console.log(`   ⏭️  Course already exists: ${course.title}`);
        totalSkipped++;
      }
    }

    // ✅ Seed Lessons
    console.log("\n📖 Seeding Lessons...");
    for (const lesson of sampleData.lessons) {
      const lessonId = `${lesson.courseId}_${lesson.title.replace(/\s+/g, "_").toLowerCase()}`;
      const docRef = db.collection("lessons").doc(lessonId);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) {
        await docRef.set({
          ...lesson,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`   ✅ Created lesson: ${lesson.title}`);
        totalSeeded++;
      } else {
        console.log(`   ⏭️  Lesson already exists: ${lesson.title}`);
        totalSkipped++;
      }
    }

    // ✅ Seed Quizzes
    console.log("\n❓ Seeding Quizzes...");
    for (const quiz of sampleData.quizzes) {
      const quizId = quiz.title.replace(/\s+/g, "_").toLowerCase();
      const docRef = db.collection("quizzes").doc(quizId);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) {
        await docRef.set({
          ...quiz,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`   ✅ Created quiz: ${quiz.title}`);
        totalSeeded++;
      } else {
        console.log(`   ⏭️  Quiz already exists: ${quiz.title}`);
        totalSkipped++;
      }
    }

    // ✅ Seed Experiments from db.json
    console.log("\n🧪 Seeding Experiments from db.json...");
    if (Array.isArray(dbData) && dbData.length > 0) {
      for (const experiment of dbData) {
        const docRef = db.collection("experiments").doc(String(experiment.id));
        const docSnapshot = await docRef.get();
        if (!docSnapshot.exists) {
          // Enhance experiment data with additional fields
          const enhancedExperiment = {
            ...experiment,
            // Map old field names to new consistent names
            class: experiment.experiment_class || experiment.class,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
          };
          
          await docRef.set(enhancedExperiment);
          console.log(`   ✅ Created experiment: ${experiment.title || `Experiment ${experiment.id}`}`);
          totalSeeded++;
        } else {
          console.log(`   ⏭️  Experiment already exists: ${experiment.title || `Experiment ${experiment.id}`}`);
          totalSkipped++;
        }
      }
    } else {
      console.log("   ⚠️  No experiments found in db.json or db.json is not an array");
    }

    // ✅ Verification and Summary
    console.log("\n🔍 Verifying seeded data...");
    const coursesCount = (await db.collection("courses").get()).size;
    const lessonsCount = (await db.collection("lessons").get()).size;  
    const quizzesCount = (await db.collection("quizzes").get()).size;
    const experimentsCount = (await db.collection("experiments").get()).size;

    console.log("\n📊 DATABASE SUMMARY:");
    console.log("================================");
    console.log(`📚 Courses:     ${coursesCount} documents`);
    console.log(`📖 Lessons:     ${lessonsCount} documents`);
    console.log(`❓ Quizzes:     ${quizzesCount} documents`);
    console.log(`🧪 Experiments: ${experimentsCount} documents`);
    console.log("================================");
    console.log(`✅ Total seeded: ${totalSeeded}`);
    console.log(`⏭️  Total skipped: ${totalSkipped}`);
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("💾 Data is now PERSISTENT in Firestore emulator!");
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// ✅ Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

// ✅ Run the seeding function
console.log("🚀 Initializing Firebase Admin SDK for emulator...");
seedDatabase()
  .then(() => {
    console.log("\n✨ All done! Your data is persistent in the emulator.");
    console.log("🔄 You can restart the emulator and data will remain.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error seeding database:", error);
    process.exit(1);
  });