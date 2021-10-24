const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (err, success) => {
      if (err) {
        return res.status(500).send({ error: err });
      }

      res.status(200).send({ data: success });
    }
  );
});

module.exports = router;
