import { Router } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.get("/", getProjects);
router.get("/:id", getProject);

router.post("/", createProject);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

export default router;