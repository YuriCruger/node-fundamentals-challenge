import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();
const currentDate = new Date().toISOString();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", {
        title: search,
        description: search,
      });

      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        res.writeHead(400).end("Title and description are required");
        return;
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: currentDate,
        updated_at: currentDate,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        res.writeHead(400).end("Title and description are required");
        return;
      }

      database.update("tasks", id, {
        title,
        description,
        updated_at: currentDate,
      });

      return res.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select("tasks");

      const task = tasks.find((task) => task.id === id);

      if (!task) {
        res.writeHead(400).end("Task id does not exist");
        return;
      }

      database.update("tasks", id, {
        completed_at: currentDate,
        updated_at: currentDate,
      });

      return res.writeHead(204).end();
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const tasks = database.select("tasks");

      const task = tasks.find((task) => task.id === id);

      if (!task) {
        res.writeHead(400).end("Task id does not exist");
        return;
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
