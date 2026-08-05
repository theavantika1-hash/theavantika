const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getCouponsForUser,
  addCoupon,
  assignCouponUsers,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require('../controllers/couponController');

router.get('/', getCoupons);
router.get('/user', getCouponsForUser);
router.post('/', addCoupon);
router.post('/assign', assignCouponUsers);
router.post('/validate', validateCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
