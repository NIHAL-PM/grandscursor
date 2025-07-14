import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Auth middleware
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Auto-create default admin user on first run
(async () => {
  const count = await prisma.user.count();
  if (count === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash } });
    console.log(`Default admin created. Email: ${email} Password: ${password}`);
  }
})();

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// =============== Contact Settings ===============
app.get('/api/contact-settings', async (_req, res) => {
  try {
    let settings = await prisma.contactSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      // create default empty settings
      settings = await prisma.contactSettings.create({
        data: {
          id: 1,
          phoneNumber: '',
          whatsappNumber: '',
          emailAddress: '',
        },
      });
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const contactSchema = z.object({
  phoneNumber: z.string(),
  whatsappNumber: z.string(),
  emailAddress: z.string().email(),
});

app.put('/api/contact-settings', authMiddleware, async (req, res) => {
  const parse = contactSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parse.error.errors });
  }
  try {
    const updated = await prisma.contactSettings.upsert({
      where: { id: 1 },
      update: parse.data,
      create: { id: 1, ...parse.data },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============== Catalog Management ===============

const uploadDir = path.join(__dirname, '..', 'uploads', 'catalogs');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });

// Get current catalog
app.get('/api/catalog/current', async (_req, res) => {
  try {
    const current = await prisma.catalogFile.findFirst({ where: { isCurrent: true }, orderBy: { uploadedAt: 'desc' } });
    if (!current) return res.status(404).json({ message: 'No catalog set as current' });
    res.json(current);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload new catalog
app.post('/api/catalog', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File required' });
  const { version } = req.body as { version?: string };
  try {
    const created = await prisma.catalogFile.create({
      data: {
        fileUrl: `/uploads/catalogs/${req.file.filename}`,
        fileName: req.file.originalname,
        version: version || null,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update catalog flags
app.patch('/api/catalog/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { isCurrent } = req.body as { isCurrent?: boolean };
  try {
    if (isCurrent) {
      // reset previous current
      await prisma.catalogFile.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
    }
    const updated = await prisma.catalogFile.update({ where: { id }, data: { isCurrent: Boolean(isCurrent) } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete catalog
app.delete('/api/catalog/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const file = await prisma.catalogFile.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ message: 'Catalog not found' });
    // delete file from disk
    const absolute = path.join(__dirname, '..', file.fileUrl);
    fs.unlink(absolute, (err) => {
      if (err) console.error('Error deleting file', err);
    });
    await prisma.catalogFile.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/catalog', async (_req, res) => {
  try {
    const list = await prisma.catalogFile.findMany({ orderBy: { uploadedAt: 'desc' } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============== Products ===============
import multer from 'multer';
const productUpload = multer({ dest: 'uploads/products/' });

app.get('/api/products', async (_req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

app.post('/api/products', authMiddleware, productUpload.single('image'), async (req, res) => {
  const { name, description, category, price, rating } = req.body;
  const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : '';
  const product = await prisma.product.create({
    data: { name, description, category, price: price ? Number(price) : null, rating: rating ? Number(rating) : null, imageUrl }
  });
  res.status(201).json(product);
});

app.put('/api/products/:id', authMiddleware, productUpload.single('image'), async (req, res) => {
  const { name, description, category, price, rating } = req.body;
  const data: any = { name, description, category, price: price ? Number(price) : null, rating: rating ? Number(rating) : null };
  if (req.file) data.imageUrl = `/uploads/products/${req.file.filename}`;
  const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data });
  res.json(product);
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Deleted' });
});

// =============== Store Locator ===============
app.get('/api/stores', async (_req, res) => {
  const stores = await prisma.storeLocation.findMany();
  res.json(stores);
});

app.post('/api/stores', authMiddleware, async (req, res) => {
  const { name, address, lat, lng, phone } = req.body;
  const store = await prisma.storeLocation.create({
    data: { name, address, lat: Number(lat), lng: Number(lng), phone }
  });
  res.status(201).json(store);
});

app.put('/api/stores/:id', authMiddleware, async (req, res) => {
  const { name, address, lat, lng, phone } = req.body;
  const store = await prisma.storeLocation.update({
    where: { id: Number(req.params.id) },
    data: { name, address, lat: Number(lat), lng: Number(lng), phone }
  });
  res.json(store);
});

app.delete('/api/stores/:id', authMiddleware, async (req, res) => {
  await prisma.storeLocation.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Deleted' });
});

// =============== About Us ===============
const aboutUpload = multer({ dest: 'uploads/about/' });

app.get('/api/about', async (_req, res) => {
  let about = await prisma.aboutPage.findUnique({ where: { id: 1 }, include: { teamProfiles: true } });
  if (!about) {
    about = await prisma.aboutPage.create({
      data: { id: 1, heroImage: '', story: '', stats: '', manufacturingExcellence: '' }
    });
  }
  res.json(about);
});

app.put('/api/about', authMiddleware, aboutUpload.single('heroImage'), async (req, res) => {
  const { story, stats, manufacturingExcellence } = req.body;
  const data: any = { story, stats, manufacturingExcellence };
  if (req.file) data.heroImage = `/uploads/about/${req.file.filename}`;
  const about = await prisma.aboutPage.update({ where: { id: 1 }, data });
  res.json(about);
});

// Team Profiles
const teamUpload = multer({ dest: 'uploads/about/team/' });

app.post('/api/about/team', authMiddleware, teamUpload.single('image'), async (req, res) => {
  const { name } = req.body;
  const imageUrl = req.file ? `/uploads/about/team/${req.file.filename}` : '';
  const profile = await prisma.teamProfile.create({
    data: { name, imageUrl, aboutPageId: 1 }
  });
  res.status(201).json(profile);
});

app.put('/api/about/team/:id', authMiddleware, teamUpload.single('image'), async (req, res) => {
  const { name } = req.body;
  const data: any = { name };
  if (req.file) data.imageUrl = `/uploads/about/team/${req.file.filename}`;
  const profile = await prisma.teamProfile.update({ where: { id: Number(req.params.id) }, data });
  res.json(profile);
});

app.delete('/api/about/team/:id', authMiddleware, async (req, res) => {
  await prisma.teamProfile.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Deleted' });
});

// =============== Distributor ===============
const distributorUpload = multer({ dest: 'uploads/distributor/' });

app.get('/api/distributor', async (_req, res) => {
  let distributor = await prisma.distributorPage.findUnique({ where: { id: 1 }, include: { stories: true } });
  if (!distributor) {
    distributor = await prisma.distributorPage.create({
      data: { id: 1, infoSections: '', requirements: '', supportServices: '' }
    });
  }
  res.json(distributor);
});

app.put('/api/distributor', authMiddleware, async (req, res) => {
  const { infoSections, requirements, supportServices } = req.body;
  const distributor = await prisma.distributorPage.update({
    where: { id: 1 },
    data: { infoSections, requirements, supportServices }
  });
  res.json(distributor);
});

// Distributor Stories
const storyUpload = multer({ dest: 'uploads/distributor/stories/' });

app.post('/api/distributor/stories', authMiddleware, storyUpload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/distributor/stories/${req.file.filename}` : '';
  const story = await prisma.distributorStory.create({
    data: { title, content, imageUrl, distributorPageId: 1 }
  });
  res.status(201).json(story);
});

app.put('/api/distributor/stories/:id', authMiddleware, storyUpload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const data: any = { title, content };
  if (req.file) data.imageUrl = `/uploads/distributor/stories/${req.file.filename}`;
  const story = await prisma.distributorStory.update({ where: { id: Number(req.params.id) }, data });
  res.json(story);
});

app.delete('/api/distributor/stories/:id', authMiddleware, async (req, res) => {
  await prisma.distributorStory.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));