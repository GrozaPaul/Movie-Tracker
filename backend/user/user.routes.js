import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("User list");
});

router.get("/new", (req, res) => {
  res.send("User New Form");
});

router
  .route("/:id")
  .get((req, res) => {
    console.log(req.user);
    res.send(`Get User with ID ${req.params.id}`);
  })
  .put((req, res) => {
    res.send(`Created User with ID ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`Deleted User with ID ${req.params.id}`);
  });

const users = [{ name: "Kyle" }, { name: "Sally" }];
// middleware - this runs before the router above. anytime the id is specified in the request, the callback fn runs, and then the respective route above
router.param("id", (req, res, next, id) => {
  req.user = users[id];
  next();
});

export default router;
