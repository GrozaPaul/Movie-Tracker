import express from "express";

const router = express.Router();

router
  .route("/:id")
  .get((req, res) => {
    res.send(`Film with ${req.params.id} id`);
  })
  .post((req, res) => {
    res.send(`Created film with ${req.params.id} id`);
  })
  .delete((req, res) => {
    res.send(`Deleted film with ${req.params.id} id`);
  });

export default router;
