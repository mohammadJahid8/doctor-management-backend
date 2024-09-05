import express from 'express';
import { ArticleController } from './article.controller.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/create', upload.single('file'), ArticleController.createArticle);
router.get('/single/:id', ArticleController.getArticleById);
router.get('/', ArticleController.getAllArticles);

router.patch('/update/:id', ArticleController.updateArticle);
router.delete('/delete/:id', ArticleController.deleteArticle);

export const ArticleRoutes = router;
