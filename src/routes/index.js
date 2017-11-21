import { Router } from 'express';

import models from '../config/database';
import { createAPIResponse } from '../utils/helpers';

const router = Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Hello logged in' });
  } else {
    res.json({ message: 'Not logged in' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await models.User.create({ email, username });
    const auth = await models.LocalAuth.create({ password });
    await user.setLocalAuth(auth);
    // send verification email
    return res.json(createAPIResponse(true, { success: true }));
  } catch (error) {
    console.log(error);

    if (error.name === 'SequelizeUniqueConstraintError' && error.fields) {
      const fields = Object.keys(error.fields);

      if (fields.includes('username')) {
        return res.status(409).json(createAPIResponse(false, 'Username already taken', 409));
      }

      if (fields.includes('email')) {
        // send notification email
        return res.json(createAPIResponse(true, { success: true }));
      }
    } else {
      return res.status(500).json(createAPIResponse(false, 'Unexpected server error', 500));
    }
  }
});

export default router;