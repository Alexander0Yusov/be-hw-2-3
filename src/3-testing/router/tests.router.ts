import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../core/types/HttpStatus';
import {
  blogCollection,
  postCollection,
  userCollection,
} from '../../db/mongo.db';

export const testRouter = Router({});

testRouter.delete('/all-data', async (req: Request, res: Response) => {
  //truncate db
  await Promise.all([
    blogCollection.deleteMany(),
    postCollection.deleteMany(),
    userCollection.deleteMany(),
  ]);

  res.sendStatus(HttpStatus.NoContent);
});
