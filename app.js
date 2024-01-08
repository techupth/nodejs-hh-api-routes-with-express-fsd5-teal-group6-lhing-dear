// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";

const app = express();
const port = 4000;
let assignmentsMockDatabase = assignments;

// เป็นตัวบอกว่า server ทำงานที่ port ไหน
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

// ดูแบบทดสอบทั้งหมด + ใส่ limit
app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentsWithLimit = assignmentsMockDatabase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsWithLimit,
  });
});

// ดูแบบทดสอบแต่ละอันด้วย id
app.get(`/assignments/:assignmentsId`, (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsMockDatabase.filter((item) => {
    return item.id === assignmentsIdFromClient;
  });
  if (!assignmentsData[0]) {
    return res.json({ message: "Data not found" });
  }
  return res.json({
    data: assignmentsData[0],
    message: "Complete Fetching assignments",
  });
});

// สร้างแบบทดสอบใหม่
// เพิ่มโค้ดที่ทำให้ access ข้อมูลใน body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(`/assignments`, (req, res) => {
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsMockDatabase[assignmentsMockDatabase.length - 1],
  });
});

// ลบแบบทดสอบแต่ละอันด้วย id // ทำตัว error ด้วย
app.delete(`/assignments/:assignmentsId`, (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentsId);
  // หาข้อมูลใน mock data ว่ามีหรือไม่
  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });
  // ถ้าไม่มี ให้ return error กลับไป
  if (!hasFound) {
    return res.json({ message: "Cannot delete, No data available!" });
  }
  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });
  assignmentsMockDatabase = newAssignments;
  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient} has been deleted successfully`,
  });
});

//แก้ไขแบบทดสอบแต่ละอันด้วย id // ทำตัว error ด้วย
app.put("/assignments/:assignmentsId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });
  if (!hasFound) {
    return res.json({ message: "Cannot update, No data available!" });
  }
  const assignmentIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });
  assignmentsMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...req.body,
  };
  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient} has been updated successfully`,
    data: assignmentsMockDatabase[assignmentIndex],
  });
});
