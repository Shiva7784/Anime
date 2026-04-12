import express from 'express'
import { addtolist, deleteList, getallList } from '../controllers/listcontroller.js';


const ListRouter = express.Router();

ListRouter.get("/all",getallList)
ListRouter.post("/add",addtolist);
ListRouter.delete('/delete/:id',deleteList);

export default ListRouter;